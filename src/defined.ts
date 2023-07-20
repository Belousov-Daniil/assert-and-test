//////////////////////////////////////////////////////
// Package:     Assertion Pipe                      //
//                                                  //
// Created by:  RDMT STUDIOS 1986                   //
// Author:      VNDG.index                          //
//////////////////////////////////////////////////////


export class KilledManuallyError extends Error {
    message: string = 'Procedure was killed manually before being done';
};