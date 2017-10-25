/* eslint-disable no-param-reassign */

import { makeExecutableSchema } from 'graphql-tools';
import moment from 'moment';
import { mapValues } from 'lodash';

import { Summoners, Matchlists, Champions } from 'modules/summoner/models';
import Connector from 'common/connectors/lol';
import regions from 'staticData/regions';

const rootSchema = [`
  type Champion {
    id: ID
    name: String
    title: String
    championIcon: String
  }

  type Matchlist {
    id: ID
    champion: Champion
    timestamp: String
  }

  type Summoner {
    id: ID
    name: String
    profileIcon: String
    summonerLevel: Int
    recentMatchlists: [Matchlist]
  }

  type Region {
    summonerByName(summoner: String): Summoner
  }

  type Query {
    region(region: ID) : Region
  }
`];

const staticDataConnectors =
  mapValues(regions, (val, key) => new Connector({ region: key }));

const rootResolvers = {
  Query: {
    region: (root, { region }, context) => {
      const regionConfig = regions[region];
      if (!regionConfig) {
        return null;
      }
      const connector = new Connector({ region });
      context.Summoners = new Summoners({ connector });
      context.Matchlists = new Matchlists({ connector });
      context.Champions = new Champions({ connector: staticDataConnectors[region] });
      return regionConfig;
    },
  },

  Region: {
    summonerByName: (region, { summoner }, context) =>
      context.Summoners.getSummonerByName(summoner),
  },

  Summoner: {
    profileIcon: ({ profileIconId }) => `//ddragon.leagueoflegends.com/cdn/7.20.3/img/profileicon/${profileIconId}.png`,
    recentMatchlists: ({ accountId }, args, context) =>
      context.Matchlists.getRecentByAccount(accountId),
  },

  Matchlist: {
    id: ({ gameId }) => gameId,
    timestamp: ({ timestamp }) => moment(timestamp).format(),
    champion: ({ champion }, args, context) =>
      context.Champions.getById(champion),
  },

  Champion: {
    championIcon: ({ key }) => `//ddragon.leagueoflegends.com/cdn/7.20.3/img/champion/${key}.png`,
  },

};

const executableSchema = makeExecutableSchema({
  typeDefs: rootSchema,
  resolvers: rootResolvers,
});

export default executableSchema;

