//////////////////////////////////////////////////////
// Package:     Assertion Pipe                      //
//                                                  //
// Created by:  RDMT STUDIOS 1986                   //
// Author:      VNDG.index                          //
//////////////////////////////////////////////////////


/**
 * ### Test
 * An Assertion is a model, which consists of computable assertion
 * and signaling abouts it's truthfulness statement, resulting value of which
 * denoting confirmation of the assertion assumption.
 * 
 * @property assertFunc - function that is executed during testing process
 * and returns a confirming value, which determines positive or negative testing results
 * @property expects - calculation, which leads to expected positive assertion result
 */
export class Assertion<T extends any> {
    public constructor(
        /**
         * Test assertion
         * @argument detailsWriter: {@link DetailsIOWriter} -> interface to interact with temporary console
         * provided for this assertion. Used to display data in UI locally during Test.
         * @returns Generic type of this assertion, which shoud indicate, is assertion ended with positive result or not
         */
        protected readonly assert: (logger: Console) => Promise<T>,
        /**
         * Calculation with assertions returned value indicating expected positive
         * result of assertion - this {@link assertFunc}.
         */
        protected readonly expects: (result: T) => boolean,
    ) {};
    
    public async test(logger: Console = console): Promise<[boolean, T]> {
        const result = await this.assert(logger);
        return [this.expects(result), result]
    };
};