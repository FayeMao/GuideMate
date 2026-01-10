'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { immersalConfig, defaultCheckpoints, CheckpointConfig } from './immersal-config';
import { 
  calculateDistance, 
  formatDistance, 
  getDirectionInstruction, 
  calculateBearing,
  initializeImmersalVPS,
  poseToPosition,
  type ImmersalPose
} from './immersal-utils';

interface Checkpoint extends CheckpointConfig {
  reached: boolean;
}

export default function NavigationPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentCheckpoint, setCurrentCheckpoint] = useState<number>(0);
  const [distanceToCheckpoint, setDistanceToCheckpoint] = useState<number>(0);
  const [isLocalizing, setIsLocalizing] = useState(false);
  const [isLocalized, setIsLocalized] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const positionRef = useRef<{ x: number; y: number; z: number } | null>(null);
  const vpsRef = useRef<any>(null);
  const lastDistanceAnnouncementRef = useRef<number>(0);
  const distanceUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentCheckpointRef = useRef<number>(0);

  // Initialize checkpoints from config
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>(
    defaultCheckpoints.map(cp => ({ ...cp, reached: false }))
  );

  // Initialize Web Speech API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Update ref when currentCheckpoint changes
  useEffect(() => {
    currentCheckpointRef.current = currentCheckpoint;
  }, [currentCheckpoint]);

  // Speak text using Web Speech API
  const speak = (text: string) => {
    if (synthRef.current) {
      // Cancel any ongoing speech
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      synthRef.current.speak(utterance);
    }
  };

  // Check if user has reached a checkpoint
  const checkCheckpointProximity = useCallback((userPosition: { x: number; y: number; z: number }) => {
    setCheckpoints(prevCheckpoints => {
      const checkpointIndex = currentCheckpointRef.current;
      if (checkpointIndex >= prevCheckpoints.length) return prevCheckpoints;

      const checkpoint = prevCheckpoints[checkpointIndex];
      const distance = calculateDistance(userPosition, checkpoint.position);
      setDistanceToCheckpoint(distance);

      const threshold = immersalConfig.localizationSettings.checkpointProximityThreshold;

      // If within threshold of checkpoint, mark as reached
      if (distance < threshold && !checkpoint.reached) {
        const updatedCheckpoints = [...prevCheckpoints];
        updatedCheckpoints[checkpointIndex].reached = true;
        
        speak(checkpoint.instruction);
        
        // Move to next checkpoint if not at the last one
        if (checkpointIndex < prevCheckpoints.length - 1) {
          setTimeout(() => {
            const nextIndex = checkpointIndex + 1;
            setCurrentCheckpoint(nextIndex);
            currentCheckpointRef.current = nextIndex;
            const nextCheckpoint = prevCheckpoints[nextIndex];
            const nextDistance = calculateDistance(userPosition, nextCheckpoint.position);
            const bearing = calculateBearing(userPosition, nextCheckpoint.position);
            const direction = getDirectionInstruction(bearing);
            
            speak(`Proceed to ${nextCheckpoint.name}. It is ${formatDistance(nextDistance)} away, ${direction}.`);
            lastDistanceAnnouncementRef.current = 0;
          }, 3000);
        } else {
          // Reached final destination
          speak('Navigation complete. You have reached your destination.');
        }
        
        return updatedCheckpoints;
      } else if (!checkpoint.reached && distance > threshold) {
        // Provide periodic distance and direction updates
        const timeSinceLastAnnouncement = Date.now() - lastDistanceAnnouncementRef.current;
        
        // Announce every 5 seconds or when distance changes significantly
        if (timeSinceLastAnnouncement > 5000) {
          const bearing = calculateBearing(userPosition, checkpoint.position);
          const direction = getDirectionInstruction(bearing);
          speak(`${formatDistance(distance)} to ${checkpoint.name}, ${direction}.`);
          lastDistanceAnnouncementRef.current = Date.now();
        }
      }
      
      return prevCheckpoints;
    });
  }, []);

  // Initialize camera stream
  const initializeCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      setIsInitialized(true);
      speak('Camera initialized. Starting localization...');
      startLocalization();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to access camera';
      setError(errorMessage);
      speak(`Error: ${errorMessage}. Please grant camera permissions.`);
    }
  };

  // Start Immersal VPS localization
  const startLocalization = async () => {
    if (!videoRef.current) {
      setError('Video element not available');
      return;
    }

    setIsLocalizing(true);
    speak('Attempting to localize your position. Please point your device around the environment.');

    try {
      // Check if we have Immersal credentials
      const hasCredentials = immersalConfig.developerToken && immersalConfig.mapId > 0;

      if (hasCredentials) {
        // Use real Immersal VPS
        try {
          vpsRef.current = await initializeImmersalVPS(
            immersalConfig.developerToken,
            immersalConfig.mapId,
            videoRef.current
          );

          // Set up pose update callback
          vpsRef.current.onPoseUpdate = (pose: ImmersalPose) => {
            if (pose.confidence >= immersalConfig.localizationSettings.minConfidence) {
              if (!isLocalized) {
                setIsLocalized(true);
                setIsLocalizing(false);
                speak(`Localization successful! You are at ${checkpoints[0].name}. ${checkpoints[0].instruction}`);
              }

              const position = poseToPosition(pose);
              positionRef.current = position;
              checkCheckpointProximity(position);
            } else if (!isLocalized) {
              speak('Still localizing. Please move your device slowly around the area.');
            }
          };
        } catch (immersalError) {
          console.warn('Immersal VPS initialization failed, using demo mode:', immersalError);
          // Fall through to demo mode
          startDemoMode();
        }
      } else {
        // Demo mode - simulate position updates
        startDemoMode();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start localization';
      setError(errorMessage);
      setIsLocalizing(false);
      speak(`Error: ${errorMessage}`);
    }
  };

  // Demo mode for testing without Immersal credentials
  const startDemoMode = () => {
    speak('Running in demo mode. To use real localization, configure your Immersal credentials.');
    
    // Initialize at starting position
    positionRef.current = { x: 0, y: 0, z: 0 };

    // Simulate localization after 3 seconds
    setTimeout(() => {
      setIsLocalized(true);
      setIsLocalizing(false);
      speak(`Demo mode activated. You are at ${checkpoints[0].name}. ${checkpoints[0].instruction}`);
      
      // Start position update loop
      const updateLoop = () => {
        if (positionRef.current && isLocalized) {
          const targetCheckpoint = checkpoints[currentCheckpointRef.current];
          if (targetCheckpoint) {
            const dx = targetCheckpoint.position.x - positionRef.current.x;
            const dz = targetCheckpoint.position.z - positionRef.current.z;
            
            // Simulate movement toward checkpoint (for demo purposes)
            const step = 0.05;
            if (Math.abs(dx) > step) {
              positionRef.current.x += dx > 0 ? step : -step;
            }
            if (Math.abs(dz) > step) {
              positionRef.current.z += dz > 0 ? step : -step;
            }
            
            if (positionRef.current) {
              checkCheckpointProximity(positionRef.current);
            }
          }
        }
        animationFrameRef.current = requestAnimationFrame(updateLoop);
      };
      updateLoop();
    }, 3000);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (distanceUpdateIntervalRef.current) {
        clearInterval(distanceUpdateIntervalRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (vpsRef.current && typeof vpsRef.current.stop === 'function') {
        vpsRef.current.stop();
      }
    };
  }, []);

  // Handle start navigation
  const handleStartNavigation = () => {
    if (!isInitialized) {
      initializeCamera();
    }
  };

  // Handle stop navigation
  const handleStopNavigation = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (distanceUpdateIntervalRef.current) {
      clearInterval(distanceUpdateIntervalRef.current);
      distanceUpdateIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    if (vpsRef.current && typeof vpsRef.current.stop === 'function') {
      vpsRef.current.stop();
      vpsRef.current = null;
    }
    setIsInitialized(false);
    setIsLocalized(false);
    setIsLocalizing(false);
    setCurrentCheckpoint(0);
    setCheckpoints(defaultCheckpoints.map(cp => ({ ...cp, reached: false })));
    positionRef.current = null;
    lastDistanceAnnouncementRef.current = 0;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    speak('Navigation stopped.');
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Header */}
      <header className="p-4 bg-gray-900 border-b border-gray-800">
        <h1 className="text-2xl font-bold">Indoor Navigation</h1>
        <p className="text-sm text-gray-400">AR-powered navigation for visually impaired users</p>
      </header>

      {/* Main content */}
      <div className="flex-1 relative">
        {/* Camera video feed - hidden but necessary for AR */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover opacity-0"
          playsInline
          muted
          autoPlay
        />
        
        {/* Canvas for AR overlays */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />

        {/* Overlay UI */}
        <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
          {/* Status information */}
          <div className="bg-black bg-opacity-70 rounded-lg p-4 pointer-events-auto">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status:</span>
                <span className={`text-sm ${isLocalized ? 'text-green-400' : isLocalizing ? 'text-yellow-400' : 'text-gray-400'}`}>
                  {isLocalized ? 'Localized' : isLocalizing ? 'Localizing...' : 'Not Started'}
                </span>
              </div>
              
              {isLocalized && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Current Checkpoint:</span>
                    <span className="text-sm">{checkpoints[currentCheckpoint]?.name || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Distance:</span>
                    <span className="text-sm">{Math.round(distanceToCheckpoint)}m</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Progress:</span>
                    <span className="text-sm">{currentCheckpoint + 1} / {checkpoints.length}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Instructions */}
          {isLocalized && checkpoints[currentCheckpoint] && (
            <div className="bg-blue-900 bg-opacity-80 rounded-lg p-4 pointer-events-auto">
              <p className="text-sm font-medium mb-1">Current Instruction:</p>
              <p className="text-sm">{checkpoints[currentCheckpoint].instruction}</p>
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-4 pointer-events-auto">
            {!isInitialized ? (
              <button
                onClick={handleStartNavigation}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Start Navigation
              </button>
            ) : (
              <button
                onClick={handleStopNavigation}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Stop Navigation
              </button>
            )}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-red-900 bg-opacity-90 rounded-lg p-6 max-w-md pointer-events-auto">
              <h2 className="text-lg font-bold mb-2">Error</h2>
              <p className="text-sm mb-4">{error}</p>
              <button
                onClick={() => setError(null)}
                className="bg-red-700 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation path visualization (for debugging/testing) */}
      {isLocalized && (
        <div className="p-4 bg-gray-900 border-t border-gray-800">
          <p className="text-xs text-gray-400 mb-2">Navigation Path:</p>
          <div className="space-y-1">
            {checkpoints.map((checkpoint, index) => (
              <div
                key={checkpoint.id}
                className={`text-xs p-2 rounded ${
                  index === currentCheckpoint
                    ? 'bg-blue-600'
                    : checkpoint.reached
                    ? 'bg-green-700'
                    : 'bg-gray-700'
                }`}
              >
                {index + 1}. {checkpoint.name}
                {checkpoint.reached && ' ✓'}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions modal for first-time users */}
      <div className="p-4 bg-gray-900 border-t border-gray-800 text-sm space-y-2">
        <p className="font-semibold">Instructions:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-300">
          <li>Grant camera permissions when prompted</li>
          <li>Point your device around the environment to localize</li>
          <li>Follow the audio instructions to navigate</li>
          <li>The app will guide you to each checkpoint</li>
        </ul>
      </div>
    </div>
  );
}
