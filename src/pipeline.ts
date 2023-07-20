//////////////////////////////////////////////////////
// Package:     Assertion Pipe                      //
//                                                  //
// Created by:  RDMT STUDIOS 1986                   //
// Author:      VNDG.index                          //
//////////////////////////////////////////////////////


import { Assertion } from "./assertion";
import { KilledManuallyError } from "./defined";
import {
    AssertionPipelineResult,
    EventAssertionDone,
    EventAssertionError,
    EventFlagsObject,
    PipelineFlowEventHandler,
    PipelineLoopTestResult,
} from "./types";

/**
 * ### Testing pipeline
 * 
 * It's event-driven, modular assertions handler with pipeline-like
 * concept, which provides an opportunity to controll testing flow
 * during tests handling.
 * 
 * Constructor accepts an array of {@link Assertion}.
 */
export class AssertionPipeline<T extends any> {
    public constructor(private readonly assertions: Assertion<T>[]) {};

    /**
     * Local logger which is passed to assertion
     */
    public logger: Console = console;
    /**
     * Fired when single test is done,
     * no matter it done good or none
     */
    public onTestDone:  PipelineFlowEventHandler = () => undefined;
    /**
     * Fired when error catched during test
     */
    public onTestError: PipelineFlowEventHandler = () => undefined;
    /**
     * 
     */
    public onLoopDone:  PipelineFlowEventHandler = () => undefined;

    /**
     * Creates a flag reader object, that is used
     * to interact with user within `controller`.
     * 
     * {@link EventFlagsObject} is returned as and interface,
     * which provides reading access via `readFlags`
     * and writing - via `controller`.
     */
    private static createEventFlagsChecker(): EventFlagsObject {
        let kill = false, restart = false
        return {
            readFlags: () => {
                const res: [boolean, boolean] = [kill, restart];
                kill = false; restart = false;
                return res;
            },
            controller: {
                kill(): void { kill = true; },
                addLoop(): void { restart = true; },
            },
        };
    };

    /**
     * Starts testing pipeline.
     * 
     * @param loopsCount how many times pipeline goes
     * through it's assertions buffer.
     * @returns AssertionPipelineResult - results, Error|undefined - used to indicate
     * pipeline unexpected behaviour, when it's stopped manuall or something.
     */
    public async run(loopsCount: number = 1): Promise<[AssertionPipelineResult, Error|undefined]> {
        const finalResult: AssertionPipelineResult = {
            failed: [],
            succed: [],
            errord: [],
            loops: 0,
        };

        return new Promise(async (resolve) => {
            for (let loop = 0; loop < loopsCount; loop++) {

                const loopResults: PipelineLoopTestResult = {
                    failed: [], succed: [], errord: [], loopIndex: loop };

                const flags = AssertionPipeline.createEventFlagsChecker();
                const checkFlags = (kf: boolean, lf: boolean) => {
                    if (lf) loopsCount++;
                    if (kf) resolve([finalResult, new KilledManuallyError()]);
                };

                for (let test_index = 0; test_index < this.assertions.length; test_index++) {
                    const started_at = performance.now();

                    try {
                        const [status, result] = await this.assertions[test_index].test(this.logger);
                        const ended_at = performance.now();
                        const event: EventAssertionDone = {
                            status:     status,
                            assertion:  this.assertions[test_index],
                            got:        result,
                            time:       ended_at - started_at,
                            position:   test_index,
                            loop:       loop,
                        };
                        if (event.status) {
                            loopResults.succed.push(event);
                            finalResult.succed.push(event);
                        } else {
                            loopResults.failed.push(event);
                            finalResult.failed.push(event);
                        };
                        this.onTestDone(event, flags.controller);

                    } catch {
                        const event: EventAssertionError = {
                            assertion:  this.assertions[test_index],
                            time:       performance.now() - started_at,
                            position:   test_index, loop: loop };
                        
                        loopResults.errord.push(event);
                        finalResult.errord.push(event);
                        this.onTestError(event, flags.controller);
                    };
                    checkFlags(...flags.readFlags());
                    continue;

                };
                this.onLoopDone(loopResults, flags.controller);
                finalResult.loops++;

            };
            resolve([finalResult, undefined]);
        });
    };
};