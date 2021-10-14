import type {NextPage} from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import {gql, useQuery, NetworkStatus} from "@apollo/client";
import {
    Alert, AlertDescription,
    AlertIcon,
    AlertTitle,
    Box,
    Button,
    Divider,
    Heading,
    IconButton,
    SimpleGrid,
    Spinner,
    Stack
} from "@chakra-ui/react"
import {ArrowBackIcon, ArrowForwardIcon, SearchIcon} from "@chakra-ui/icons";


let pageNumber = 1
const GET_PEOPLE = gql`
    query People($pageNumber:Float!) {
        people(page:$pageNumber) {
            name
        }
    }
`;

const Home: NextPage = () => {

    const {data, loading, error, refetch, networkStatus} = useQuery(GET_PEOPLE, {
        variables: {pageNumber: pageNumber},
        notifyOnNetworkStatusChange: true,
    });

    let handleNextClick = () => {
        if (pageNumber == 9) return;
        pageNumber += 1

        refetch({
            pageNumber: pageNumber
        })
    }

    let handlePreviousClick = () => {
        if (pageNumber == 1) return;

        pageNumber -= 1

        refetch({
            pageNumber: pageNumber
        })
    }


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
                            Oops something went wrong!
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
                <Image src="/star-wars.svg" alt="Star Wars Logo" width={120} height={120}/>

                <SimpleGrid columns={2} spacing={10}>
                    {data.people.map((person: any) => (
                        <Link key={person.name}  href={{
                            pathname: '/people/[person]',
                            query: {person: person.name},
                        }}>
                            <Box maxW="sm" p={6} borderWidth="1px" borderRadius="md" overflow="hidden"
                                 boxShadow="base" cursor="pointer">
                                <Stack direction="row" spacing={2}>
                                    <Divider orientation="vertical"/>

                                    <Heading mb="0" as="a" size="lg">{person.name}</Heading>

                                </Stack>
                            </Box>
                        </Link>
                    ))}
                </SimpleGrid>
                <br/>

                <Stack direction="row" spacing={4}>
                    {pageNumber > 1 &&
                    <IconButton onClick={handlePreviousClick} aria-label="Previous Page" icon={<ArrowBackIcon/>}
                                colorScheme="black" variant="outline"/>
                    }
                    <IconButton onClick={handleNextClick} aria-label="Next Page" icon={<ArrowForwardIcon/>}
                                colorScheme="black" variant="outline"/>


                </Stack>
            </main>

        </div>
    )
}


export default Home
