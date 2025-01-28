export function sortIdeasByRank(ideas) {
    return ideas.sort((a, b) => {
      if (a.rank === null || a.rank === undefined) return 1;
      if (b.rank === null || b.rank === undefined) return -1;
      return b.rank - a.rank;
    });
  }  