import {useRouter} from 'next/router'
import {gql, NetworkStatus, useQuery} from "@apollo/client";
import styles from "../../styles/Home.module.css";
import Image from "next/image";
import Link from 'next/link';
import {Alert, AlertDescription, AlertIcon, AlertTitle, Heading, Spinner, Box,Text} from "@chakra-ui/react";
import Head from "next/head";
import _ from "lodash";


const GET_PERSON = gql`
    query Person($name:String!) {
        person(name:$name) {
            name,
            height,
            mass,
            gender,
            homeworld
        }
    }
`;

const Person = () => {
    const router = useRouter()
    const {person} = router.query

    const {data, loading, error, refetch, networkStatus} = useQuery(GET_PERSON, {
        variables: {name: person},
        notifyOnNetworkStatusChange: true,
    });

    if (loading || networkStatus === NetworkStatus.refetch) {
        return (
            <div className={styles.container}>
                <Image src="/star-wars.svg" alt="Star Wars Logo" width={120} height={120}/>
                <Spinner/>
            </div>

        )
    }

    if (error) {
        console.error(error);
        return (
            <div className={styles.container}>
                <main className={styles.main}>
                    <Image src="/star-wars.svg" alt="Star Wars Logo" width={120} height={120}/>
                    <Alert
                        status="error"
                        variant="subtle"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        textAlign="center"
                        height="200px"
                        mr={10}
                        ml={10}
                    >
                        <AlertIcon boxSize="40px" mr={0}/>
                        <AlertTitle mt={4} mb={1} fontSize="lg">
                            This one could not be found!
                        </AlertTitle>
                        <AlertDescription maxWidth="sm">
                            Go back home?
                            <br/>
                            <hr/>
                            <Link href="/"> Home</Link>
                        </AlertDescription>
                    </Alert>
                </main>

            </div>

        )
    }


    return (
        <div className={styles.container}>
            <Head>
                <title>Star Wars</title>
                <meta name="description" content="The People from Star Wars"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main className={styles.main}>
                <Link href="/">
                    <Image src="/star-wars.svg" alt="Star Wars Logo" width={120} height={120}/>
                </Link>

                <Box maxW="sm" p={10} borderWidth="1px" borderRadius="lg" overflow="hidden"
                     boxShadow="base">
                    <Heading mb="0" as="a" size="lg" fontFamily="DeathStar">{person}</Heading>
                    <br/>
                    <hr/>
                    <br/>

                    <Text fontSize="lg">📏</Text>
                    <Text fontSize="lg">Height: {_.capitalize(data.person.height)}</Text>
                    <br/>

                    <Text fontSize="lg">⚖️</Text>
                    <Text fontSize="lg">Mass: {_.capitalize(data.person.mass)}</Text>
                    <br/>


                    <Text fontSize="lg">{data.person.gender == 'n/a' || data.person.gender == 'none' ? (
                        <p>🤖</p>

                    ) : (
                        <p>🧑🏽</p>
                    )} Gender: {_.capitalize(data.person.gender)}</Text>
                    <br/>

                    <Text fontSize="lg">🌐</Text>
                    <Text fontSize="lg">Home World: {_.capitalize(data.person.homeworld)}</Text>
                </Box>
            </main>
        </div>
    )
}

export default Person
