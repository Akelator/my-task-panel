export enum TaskState {
  PANEL_ID = 'panel_id',
  NEW = 'new',
  HIDDEN = 'hidden',
  REVIEW = 'review',
  TODO = 'todo',
  PROGRESS = 'progress',
  DONE = 'done',
  REMOVE = 'remove',
}

export enum TaskSort {
  new = 0,
  todo = 1,
  progress = 2,
  done = 3,
  review = 4,
  hidden = 5,
  remove = 6,
}

export enum Priority {
  LOW = 3,
  MID = 2,
  HIG = 1,
}

export interface PanelTask {
  link: string;
  code: string;
  name: string;
  state: TaskState;
  priority: Priority;
}

export interface PanelFilter {
  state: TaskState;
  visible: boolean;
  hidden?: boolean;
  panelId?: boolean;
}

export const PANEL_FILTERS: PanelFilter[] = [
  { state: TaskState.TODO, visible: true },
  { state: TaskState.PROGRESS, visible: true },
  { state: TaskState.DONE, visible: true },
  { state: TaskState.REVIEW, visible: false },
  { state: TaskState.HIDDEN, visible: false },
  { state: TaskState.REMOVE, visible: false },
  { state: TaskState.NEW, visible: true, hidden: true },
];

export const STORE_ID: string = 'my-panel';
