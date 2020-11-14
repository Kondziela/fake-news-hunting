import * as request from 'request-promise';
import {MorfeuszResponse} from "./models/models";

/**
 * Base on http://morfeusz.sgjp.pl/demo/
 */
export class MorfeuszRequest {

    // http://nkjp.pl/poliqarp/help/plse2.html
    private filterValueArray: Array<string> = [
        'prep',     // prep
        'conj',     // spójnik współrzędny
        'comp',     // spójnik podrzędny
        'qub',      // kublik
        'brev',     // skrót
        'burk',     // burkinostka
        'interj',   // wykrzyknik
        'interp',   // interpunkcja
        // 'xxx',      // ciało obce
        // 'ign'       // forma nierozpoznana
    ];

    private morfeuszURL: string = 'http://morfeusz.sgjp.pl/demo/_tag?text={{TEXT}}&dict=sgjp&aggl=strict&praet=composite&case_handling=100&whitespace=301&expand_tags=0';

    public tagFromMorfeusz(text: string): Promise<Array<MorfeuszResponse>> {
        return new Promise<Array<MorfeuszResponse>>(resolve => {
            request.get(this.morfeuszURL.replace('{{TEXT}}', encodeURIComponent(text)))
                .then(responseString => {
                    const response = JSON.parse(responseString);
                    resolve(response.dag.map(dag => {
                        const value = dag[0][0][0][1];
                        return {
                            originalValue: value[0],
                            coreValue: value[1],
                            type: value[2]
                        }
                    })
                    );
                })
        });
    }

    public filterMorfeuszValues(morfeuszArray: Array<MorfeuszResponse>): Array<MorfeuszResponse> {
        return morfeuszArray.filter(morfeusz => morfeusz.type.split(':').some(value => !this.filterValueArray.includes(value)));
    }

}