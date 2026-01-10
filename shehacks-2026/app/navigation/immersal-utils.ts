/**
 * Immersal VPS Integration Utilities
 * 
 * This file contains helper functions for integrating with Immersal VPS for Web.
 * Based on: https://github.com/immersal/vps-for-web
 */

export interface ImmersalPose {
  px: number;  // Position X
  py: number;  // Position Y
  pz: number;  // Position Z
  r00: number; r01: number; r02: number;  // Rotation matrix row 0
  r10: number; r11: number; r12: number;  // Rotation matrix row 1
  r20: number; r21: number; r22: number;  // Rotation matrix row 2
  confidence: number;
}

export interface ImmersalLocalizationResult {
  localized: boolean;
  pose?: ImmersalPose;
  error?: string;
}

/**
 * Convert Immersal pose to simple position object
 */
export function poseToPosition(pose: ImmersalPose): { x: number; y: number; z: number } {
  return {
    x: pose.px,
    y: pose.py,
    z: pose.pz,
  };
}

/**
 * Calculate distance between two 3D points
 */
export function calculateDistance(
  pos1: { x: number; y: number; z: number },
  pos2: { x: number; y: number; z: number }
): number {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  const dz = pos1.z - pos2.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Calculate bearing/direction from one point to another (in degrees)
 */
export function calculateBearing(
  from: { x: number; y: number; z: number },
  to: { x: number; y: number; z: number }
): number {
  const dx = to.x - from.x;
  const dz = to.z - from.z;
  const angle = Math.atan2(dx, dz) * (180 / Math.PI);
  return angle < 0 ? angle + 360 : angle;
}

/**
 * Get direction instruction based on bearing
 */
export function getDirectionInstruction(bearing: number): string {
  if (bearing >= 337.5 || bearing < 22.5) return 'straight ahead';
  if (bearing >= 22.5 && bearing < 67.5) return 'ahead and to your right';
  if (bearing >= 67.5 && bearing < 112.5) return 'to your right';
  if (bearing >= 112.5 && bearing < 157.5) return 'behind you and to your right';
  if (bearing >= 157.5 && bearing < 202.5) return 'behind you';
  if (bearing >= 202.5 && bearing < 247.5) return 'behind you and to your left';
  if (bearing >= 247.5 && bearing < 292.5) return 'to your left';
  if (bearing >= 292.5 && bearing < 337.5) return 'ahead and to your left';
  return 'straight ahead';
}

/**
 * Load Immersal VPS SDK
 * This loads the Immersal VPS JavaScript module
 */
export async function loadImmersalSDK(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Immersal SDK can only be loaded in the browser'));
      return;
    }

    // Check if already loaded
    if ((window as any).ImmersalSDK) {
      resolve((window as any).ImmersalSDK);
      return;
    }

    // Load from CDN or local file
    const script = document.createElement('script');
    script.src = 'https://cdn.immersal.com/web/vps/immersal-vps-web.js';
    script.async = true;
    script.onload = () => {
      if ((window as any).ImmersalSDK) {
        resolve((window as any).ImmersalSDK);
      } else {
        reject(new Error('Immersal SDK failed to load'));
      }
    };
    script.onerror = () => {
      reject(new Error('Failed to load Immersal SDK script'));
    };
    document.head.appendChild(script);
  });
}

/**
 * Initialize Immersal VPS
 */
export async function initializeImmersalVPS(
  token: string,
  mapId: number,
  videoElement: HTMLVideoElement
): Promise<any> {
  const SDK = await loadImmersalSDK();
  
  // Configure Immersal
  const config = {
    token: token,
    mapIds: [mapId],
    resolution: { width: 1280, height: 720 },
  };

  // Create VPS instance
  const vps = new SDK.VPS(config);

  // Start localization
  await vps.startLocalization(videoElement);

  return vps;
}

/**
 * Format distance for audio feedback
 */
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return 'less than 1 meter';
  } else if (distance < 10) {
    return `${Math.round(distance)} meters`;
  } else if (distance < 100) {
    return `about ${Math.round(distance / 5) * 5} meters`;
  } else {
    return `about ${Math.round(distance / 10) * 10} meters`;
  }
}
