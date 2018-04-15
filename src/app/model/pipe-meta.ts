export interface PipeMeta {
  type: PipeType;
  params: string;
}
export enum PipeType {
  None,
  Date
}
