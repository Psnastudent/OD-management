import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export const impact = (style: any = Haptics.ImpactFeedbackStyle.Light) => {
  try {
    if (Platform.OS !== 'web' && typeof Haptics.impactAsync === 'function') {
      Haptics.impactAsync(style).catch(() => {});
    }
  } catch (e) {
    // ignore
  }
};

export const notify = (type: any = Haptics.NotificationFeedbackType.Success) => {
  try {
    if (Platform.OS !== 'web' && typeof Haptics.notificationAsync === 'function') {
      Haptics.notificationAsync(type).catch(() => {});
    }
  } catch (e) {
    // ignore
  }
};

export default { impact, notify };
