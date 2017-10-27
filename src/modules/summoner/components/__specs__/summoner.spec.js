import React from 'react';
import { shallow } from 'enzyme';
import { Summoner, Error, Loading, SummonerNotFound, Summary, MatchList } from '../summoner';

describe('components', () => {
  describe('Summoner', () => {
    it('Renders with an error', () => {
      const summoner = shallow(
        <Summoner error />,
      );

      expect(summoner.contains(<Error />)).toBe(true);
    });

    it('Renders when loading', () => {
      const summoner = shallow(
        <Summoner loading />,
      );

      expect(summoner.contains(<Loading />)).toBe(true);
    });

    it('Renders summoner not found', () => {
      const summonerName = 'Fred';
      const region = 'NA';
      const summoner = shallow(
        <Summoner summoner={null} summonerName={summonerName} region={region} />,
      );
      expect(summoner.contains(<SummonerNotFound summonerName={summonerName} region={region} />))
        .toBe(true);
    });

    it('Renders summoner', () => {
      const summoner = {
        name: 'Fred',
        recentMatchlists: [],
      };

      const component = shallow(
        <Summoner summoner={summoner} />,
      );
      expect(component.contains(<Summary summoner={summoner} />)).toBe(true);
      expect(component.contains(<MatchList recentMatchlists={summoner.recentMatchlists} />))
        .toBe(true);
    });
  });
});
