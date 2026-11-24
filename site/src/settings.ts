import { useSyncExternalStore } from 'react';
import { SETTINGS, type SettingName, type SettingValue } from './theme-script';

// The settings drawer's picks (accent, font, edges, spacing),
// outside React. Each is an attribute on <html> that tokens.css turns into
// Omuk UI's tokens; THEME_SCRIPT applies the kept ones before the first
// paint, and this keeps them in step, also with another tab.

function read<Name extends SettingName>(name: Name): SettingValue<Name> {
  const { values } = SETTINGS[name];
  try {
    const kept = localStorage.getItem(name);
    const found = values.find((value) => value === kept);
    if (found) return found;
  } catch {
    // No storage (a locked-down browser): the kit's own value.
  }
  return values[0];
}

function apply(name: SettingName) {
  const { attribute, values } = SETTINGS[name];
  const value = read(name);
  const root = document.documentElement;
  if (value === values[0]) root.removeAttribute(attribute);
  else root.setAttribute(attribute, value);
}

const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) listener();
}

function isSetting(key: string | null): key is SettingName {
  return key !== null && key in SETTINGS;
}

function onStorage(event: StorageEvent) {
  if (!isSetting(event.key)) return;
  apply(event.key);
  notify();
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) window.addEventListener('storage', onStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener('storage', onStorage);
    }
  };
}

export function setSetting<Name extends SettingName>(
  name: Name,
  value: SettingValue<Name>,
) {
  try {
    if (value === SETTINGS[name].values[0]) localStorage.removeItem(name);
    else localStorage.setItem(name, value);
  } catch {
    // Not kept (a locked-down browser): the page still changes.
  }
  apply(name);
  notify();
}

/** Every setting back to the kit's own value. */
export function resetSettings() {
  for (const name of Object.keys(SETTINGS)) {
    if (isSetting(name)) setSetting(name, SETTINGS[name].values[0]);
  }
}

/** One setting's value now. Re-renders when it changes. */
export function useSetting<Name extends SettingName>(
  name: Name,
): SettingValue<Name> {
  return useSyncExternalStore(
    subscribe,
    () => read(name),
    () => SETTINGS[name].values[0],
  );
}
