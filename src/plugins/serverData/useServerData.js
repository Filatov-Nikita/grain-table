import { inject } from 'vue';

export const serverDataKey = Symbol('serverData');

export function getServerData() {
  if(!window['serverData']) throw new Error('ключ serverData не найден');
  return window['serverData'];
}

export default function() {
  const serverData = inject(serverDataKey);
  if(!serverDataKey) throw new Error('serverData не определен!');
  return serverData;
}
