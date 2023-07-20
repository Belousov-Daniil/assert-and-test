//////////////////////////////////////////////////////
// Package:     Assertion Pipe                      //
//                                                  //
// Created by:  RDMT STUDIOS 1986                   //
// Author:      VNDG.index                          //
//////////////////////////////////////////////////////


import { Assertion } from "./assertion"

export interface TestEvent {
    readonly assertion: Assertion<any>,
    readonly time: number,
    readonly position: number,
    readonly loop: number,
};

export interface EventAssertionDone extends TestEvent {
    readonly status: boolean,
    readonly got: any,
};

export interface EventAssertionError extends TestEvent {
};

export interface PipelineTestEvent {
    readonly failed: EventAssertionDone[];
    readonly succed: EventAssertionDone[];
    readonly errord: EventAssertionError[];
};

export interface AssertionPipelineResult extends PipelineTestEvent {
    loops: number,
};

export interface PipelineLoopTestResult extends PipelineTestEvent{
    readonly loopIndex: number,
};

export interface EventFlagsObject {
    readFlags: () => [boolean, boolean],
    controller: EventFlagsController,
};

export interface EventFlagsController {
    kill(): void,
    addLoop(): void,
};

export type PipelineFlowEventHandler<eventType = EventAssertionDone|EventAssertionError|PipelineLoopTestResult>
    = (event: eventType, controller: EventFlagsController) => void; 