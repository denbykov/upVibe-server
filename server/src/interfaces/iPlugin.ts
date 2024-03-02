import { iFilePlugin } from './iFilePlugin';
import { iTagPlugin } from './iTagPlugin';

export enum PluginType {
  FilePlugin = 'FilePlugin',
  TagPlugin = 'TagPlugin',
}
export type iPlugin = iFilePlugin | iTagPlugin;

export interface MergedIPlugin extends iFilePlugin, iTagPlugin {}
