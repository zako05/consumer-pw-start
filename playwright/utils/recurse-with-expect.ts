export async function recurseWithExpect(
  fn: () => Promise<void>,
  options?: {
    retries?: number
    interval?: number
    timeout?: number
  }
): Promise<void> {
  const retries = options?.retries ?? 10
  const interval = options?.interval ?? 500
  const timeout = options?.timeout ?? 10000

  const endTime = Date.now() + timeout
  let attempt = 0

  while (attempt < retries && Date.now() < endTime) {
    try {
      await fn()
      return
    } catch (error) {
      if (error instanceof Error) {
        console.warn(
          `Attempt ${attempt + 1} failed: ${error.message}. Retrying in ${interval}ms...`
        )
      } else {
        console.error(
          `Attempt ${attempt + 1} failed: An unknown error occured. Retrying in ${interval}ms...`,
          error
        )

        throw error
      }
    }

    attempt++

    await new Promise((res): Timeout => setTimeout(res, interval))
  }

  await fn()
}
