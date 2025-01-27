"use client";

export enum ScheduleEventType {
  Plenum = 1,
  Committee,
  SpecialOccasion,
}

export interface ScheduleData {
  eventsNumber: number;
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
  CommitteeId: number;
  EventName: string[];
  CommitteeDiscription?: string; // full discription of the event
  EventParticipants: CommitteeParticipant[];
  EventLiveStream?: string; // url to live stream
  EventType: ScheduleEventType;
}

export interface CommitteeParticipantsData {
  CommitteeId: number;
  CommitteeName: string;
  Participants: CommitteeParticipant[];
}

export interface CommitteeParticipant {
  ParticipantId: number;
  ParticipantName: string;
  ParticipantRole: string;
  ParticipantImage: string;
}

export interface CommitteeDescription {
  id: number;
  name: string;
  description: string;
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
  EventType: ScheduleEventType;
}

export interface KnsEvent {
  id: number;
  EventStart: Date; // "2025-01-07T12:00:00";
  EventType: ScheduleEventType; //3;
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
