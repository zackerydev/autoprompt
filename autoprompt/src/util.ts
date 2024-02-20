export function convertStringToOptions(input: string): string[] {
  // remove oneof: and of: from the input
  const cleanInput = input.replace("oneof:", "").replace("of:", "");

  // Find the content between the first < and >, inclusive.
  const regex = /<([^>]+)>/;
  const match = cleanInput.match(regex);

  // If there's a match and it has a captured group, split it by '|'
  if (match?.[1]) {
    return match[1].split('|');
  }
  // Return an empty array if no options are found
  return [];
}