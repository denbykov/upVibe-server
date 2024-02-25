import { iFilePlugin } from '@src/interfaces/iFilePlugin';
import { iTagPlugin } from '@src/interfaces/iTagPlugin';

export enum PluginType {
  FilePlugin = 'FilePlugin',
  TagPlugin = 'TagPlugin',
}
export type iPlugin = iFilePlugin | iTagPlugin;

export interface MergedIPlugin extends iFilePlugin, iTagPlugin {}
