import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'path';

export const definitionFactory = new GraphQLDefinitionsFactory();

definitionFactory.generate({
  typePaths: ['./**/*.graphql'], // which files
  path: join(process.cwd(), 'src/graphql.ts'), // where the generated types should be store
  outputAs: 'class',
  watch: true,
  skipResolverArgs: true,
  defaultTypeMapping: {
    ID: 'number',
  },
});
