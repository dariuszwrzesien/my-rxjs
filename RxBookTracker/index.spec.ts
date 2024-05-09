//Testing

import { TestScheduler } from "rxjs/testing";
import { expect } from 'chai';


describe('Book Observable', () => {

    let scheduler;

    beforeEach(() => {
        scheduler = new TestScheduler((actual, expected) => {
            expect(actual).deep.equal(expected);


    it('produce a single value and complete message', (done) => {
        scheduler.run(helpers => {
            const source$ = helpers.cold('a|'); //utworzenie nowego cold obesrvable
            const expected = 'a|'; //oczekiwane zdarzenie w formie marble syntax

            helpers.expectObservable(source$).toBe(expected); //sprawdzenie czy observable zwraca oczekiwane zdarzenia
        });
    });




})})})