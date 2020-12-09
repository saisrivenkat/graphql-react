import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import styles from "../styles/Home.module.css";
import {
  Heading,
  Input,
  SimpleGrid,
  Stack,
  IconButton,
  Text,
  Box,
  Flex,
} from "@chakra-ui/react";

import { SearchIcon, CloseIcon } from "@chakra-ui/icons";

const client = new ApolloClient({
  uri: "https://rickandmortyapi.com/graphql/",
  cache: new InMemoryCache(),
});

export default function Home(results) {
  const searchCharacters = async () => {
    const results = await client
      .query({
        query: gql`
          query {
            characters(filter: { name: "${search}" }) {
              info {
                count
              }
              results {
                name
                location {
                  name
                  id
                }
                image
                origin {
                  name
                  id
                }
                episode {
                  id
                  episode
                  air_date
                }
              }
            }
          }
        `,
      })
      .catch((e) => {
        console.log(e);
      });
    if (results) {
      const { data } = results;
      console.log(data);
      setCharacters(await data.characters.results);
    }
  };
  const intialState = results;
  const [search, setSearch] = useState("");
  const [characters, setCharacters] = useState(intialState.characters);

  return (
    <Flex direction="column" justify="center" align="center">
      <Head>
        <title>NextJS Apollo Crash Course</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box mb={4} flexDirection="column" align="center" justify="center" py={8}>
        <Heading as="h1" size="2xl" mb={8}>
          Rick and Morty{" "}
        </Heading>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            await searchCharacters();
          }}
        >
          <Stack maxWidth="350px" width="100%" isInline mb={8}>
            <Input
              placeholder="Search"
              id="search"
              value={search}
              border="none"
              onChange={(e) => setSearch(e.target.value)}
            ></Input>
            <IconButton
              colorScheme="blue"
              aria-label="Search database"
              icon={<SearchIcon />}
              disabled={search === ""}
              type="submit"
            />
            <IconButton
              colorScheme="red"
              aria-label="Search database"
              icon={<CloseIcon />}
              disabled={search === ""}
              onClick={async () => {
                setSearch("");
                setCharacters(intialState.characters);
              }}
            />
          </Stack>
        </form>
        <SimpleGrid columns={[1, 2, 3]} spacing="40px">
          {characters.map((character) => {
            return (
              <div key={character.id}>
                <Image src={character.image} width={300} height={300} />
                <Heading as="h4" align="center" size="md">
                  {character.name}
                </Heading>
                <Text align="center">Origin: {character.origin.name}</Text>
                <Text align="center">Location: {character.location.name}</Text>
              </div>
            );
          })}
        </SimpleGrid>
      </Box>

      <footer className={styles.footer}>
        Powered by Energy Drinks 🥫 and YouTube Subscribers.
      </footer>
    </Flex>
  );
}

export async function getStaticProps() {
  const { data } = await client.query({
    query: gql`
      query {
        characters(page: 1) {
          info {
            count
            pages
          }
          results {
            name
            id
            location {
              name
              id
            }
            image
            origin {
              name
              id
            }
            episode {
              id
              episode
              air_date
            }
          }
        }
      }
    `,
  });

  return {
    props: {
      info: data.characters.info,
      characters: data.characters.results,
    },
  };
}
