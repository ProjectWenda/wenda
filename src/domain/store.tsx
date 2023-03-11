import recoil from 'recoil';
import { Task } from './Task';

export const taskListState = recoil.atom<Task[]>({
  key: 'taskListState',
  default: [],
})