import { promises as fs } from 'fs'
import { logFilePath } from '../../src/events/log-file-path'
import type {
  MovieEvent,
  MovieAction
} from '../../src/events/movie-event-types'

const reshape = (entry: MovieEvent) => ({
  topic: entry.topic,
  key: entry.messages[0]?.key,
  movie: JSON.parse(entry.messages[0]?.value as unknown as string)
})

const filterByTopicAndId = (
  movieId: number,
  topic: `movie-${MovieAction}`,
  entries: MovieEvent[]
): MovieEvent[] =>
  entries.filter(
    (entry: MovieEvent): boolean => entry.topic === topic && entry.id === movieId
  )

// missing type
export const parseKafkaEvent = async (
  movieId: number,
  topic: `movie-${MovieAction}`,
  filePath = logFilePath
): Promise<MovieEvent[]> => {
  try {
    // read and proces the Kafka log file
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const entries: MovieEvent[] = fileContent
      .trim()
      .split('\n')
      .map((line): MovieEvent => JSON.parse(line) as MovieEvent)

    // filter the entries by topic and movie ID
    const filteredEntries = filterByTopicAndId(movieId, topic, entries)

    return filteredEntries
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error parsing Kafka event log: ${error.message}`)
    } else {
      console.error('An unknown error occured')
    }
    throw error
  }
}
