<script>
  let { genre, genreSearch } = $props();
  const isSearching = $derived(genreSearch.length > 0);
  
  // Split genre into parts: before match, match, and after match
  const matchIndex = $derived(genre.toLowerCase().indexOf(genreSearch));
  const parts = $derived(matchIndex >= 0 ? [
    genre.slice(0, matchIndex),
    genre.slice(matchIndex, matchIndex + genreSearch.length),
    genre.slice(matchIndex + genreSearch.length)
  ] : [genre]);
</script>

<span class="text-lg" class:text-gray-400={!isSearching} class:text-gray-500={isSearching}>
  {#each parts as part, i}
    {#if i === 1}
      <span class="text-gray-300">{part}</span>
    {:else}
      {part}
    {/if}
  {/each}
</span>