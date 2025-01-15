"use client";

export enum ScheduleEventType {
  Plenum = 1,
  Committee,
  SpecialOccasion,
}

export interface ScheduleData {
  CommiteesNumber?: number;
  CurrentDateText?: string;
  CurrentPlenumEvents: PlenumEvent[];
  CurrentCommitteeEvents: CommitteeEvent[];
  CurrentKnsEvents: KnsEvent[];
}

export interface ScheduleDataProps {
  SelectedDate: string;
  SelectedMonth: string | null;
  SelectedYear: string | null;
}

export interface CommitteeEvent {
  id: number;
  EventStart: Date; // "2025-01-07T10:30:00"
  IsCanceled: boolean;
  CommitteeName: string;
  EventName: string;
  rnkParent: number; // hour group rank
  groups: number[]; // list of all ranks of hour groups "22, 20, 18, 12, 7, 6, 4, 3, 1"
  rnkChilds: number; // id in the hour group
  EventDiscription?: string; // full discription of the event
  EventParticipants?: string[];
  EventLiveStream?: string; // url to live stream
}

export interface PlenumEvent {
  id: number;
  RowNum: number;
  // startTimeStr: Date;
  EventStart: Date;
  SessionNumber: number;
  SessionTitleStr: string; // title of the plenum session
  FK_SessionID: number;
  Name: string;
  FK_ItemID: number;
  IsBill: boolean;
  IsAgendaSug: boolean;
  FK_StatusID: number;
}

export interface KnsEvent {
  id: number;
  EventStart: Date; // "2025-01-07T12:00:00";
  EventType: number; //3;
  EventName: string;
  rnkParent: number; // hour group rank
  groups: number[]; // list of all ranks of hour groups "22, 20, 18, 12, 7, 6, 4, 3, 1"
  rnkChilds: number; // id in the hour group
}

export interface PlenumMainEvent {
  EventStart: Date;
  SessionNumber: number;
  SessionTitleStr: string; // title of the plenum session
  FK_SessionID: number; // plenum session id
  PlenumEvents: PlenumEvent[];
}
