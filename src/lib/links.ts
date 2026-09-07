import { Platform, Linking } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { colors } from '../theme';

import { isAllowedUrl } from './allowlist';
export { isAllowedUrl, ALLOWED_HOSTS } from './allowlist';

/**
 * Opens a vetted HTTPS URL in an Android Custom Tab (or a new tab on web).
 * Custom Tabs keep the user inside the app, share no cookies with the app process,
 * and show the real URL bar so the destination is visible.
 */
export async function openExternal(raw: string): Promise<boolean> {
  if (!isAllowedUrl(raw)) {
    if (__DEV__) console.warn('[links] blocked non-allowlisted URL:', raw);
    return false;
  }
  try {
    if (Platform.OS === 'web') {
      await Linking.openURL(raw);
      return true;
    }
    await WebBrowser.openBrowserAsync(raw, {
      toolbarColor: colors.bg,
      controlsColor: colors.solanaGreen,
      enableBarCollapsing: true,
      showTitle: true,
    });
    return true;
  } catch {
    return false;
  }
}
