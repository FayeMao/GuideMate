// Immersal VPS Configuration
// Replace these with your actual Immersal developer credentials
export const immersalConfig = {
  // Your Immersal Developer Token
  // Get this from: https://immersal.com/
  developerToken: process.env.NEXT_PUBLIC_IMMERSAL_TOKEN || '',

  // Map ID of your mapped indoor location
  // Create maps using the Immersal Mapper app: https://developers.immersal.com/docs/mapsmapping/howtomap/mapper-2.0/
  mapId: parseInt(process.env.NEXT_PUBLIC_IMMERSAL_MAP_ID || '0'),

  // Localization settings
  localizationSettings: {
    // Minimum localization confidence (0.0 - 1.0)
    minConfidence: 0.7,
    
    // Update frequency in milliseconds
    updateInterval: 100,
    
    // Maximum distance for checkpoint detection (in meters)
    checkpointProximityThreshold: 2.0,
  },
};

// Checkpoints configuration
// These coordinates should match the real-world positions in your mapped space
// You'll need to calibrate these based on your actual map
export interface CheckpointConfig {
  id: number;
  name: string;
  // Position in meters relative to map origin
  position: { x: number; y: number; z: number };
  instruction: string;
  // Optional: Additional metadata
  metadata?: Record<string, any>;
}

// Example checkpoints - update these based on your actual mapped location
export const defaultCheckpoints: CheckpointConfig[] = [
  {
    id: 0,
    name: 'Starting Point',
    position: { x: 0, y: 0, z: 0 },
    instruction: 'You are at the starting point. Walk forward 10 meters.',
  },
  {
    id: 1,
    name: 'Checkpoint 1',
    position: { x: 0, y: 0, z: 10 },
    instruction: 'You have reached checkpoint 1. Turn right and walk 5 meters.',
  },
  {
    id: 2,
    name: 'Checkpoint 2',
    position: { x: 5, y: 0, z: 10 },
    instruction: 'You have reached checkpoint 2. Continue straight for 8 meters.',
  },
  {
    id: 3,
    name: 'Destination',
    position: { x: 5, y: 0, z: 18 },
    instruction: 'Congratulations! You have reached your destination.',
  },
];
