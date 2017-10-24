/* eslint-disable no-param-reassign */

import { makeExecutableSchema } from 'graphql-tools';
import Bluebird from 'bluebird';

import { Summoners, Matchlists, Champions } from 'modules/summoner/models';
import Connector from 'common/connectors/lol';
import regions from 'static/regions';

const rootSchema = [`

  type Champion {
    id: ID,
    name: String
  }

  type Matchlist {
    id: ID
    champion: Champion
    timestamp: Int
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
    summonerByName(region: ID, summoner: String): Summoner
    region(region: ID) : Region
  }
`];

const rootResolvers = {
  Query: {
    region: (root, { region }, context) => {
      const regionConfig = regions[region];
      if (!regionConfig) {
        return null;
      }

      const connector = new Connector({ apiDomain: regionConfig.api });

      context.Summoners = new Summoners({ connector });
      context.Matchlists = new Matchlists({ connector });
      context.Champions = new Champions({ connector });
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
    champion: ({ champion }, args, context) =>
      context.Champions.getById(champion),
  },

};

const executableSchema = makeExecutableSchema({
  typeDefs: rootSchema,
  resolvers: rootResolvers,
});

export default executableSchema;

