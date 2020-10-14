import {ImmutableObject} from 'jimu-core';

export interface Config{
  p1: string;
  p2: string;
  start: Date;
  end: Date;
}

export type IMConfig = ImmutableObject<Config>;