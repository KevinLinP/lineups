<script>
  import Genre from './Genre.svelte';

  let title = $state('');
  let artists = $state([]);

  $effect(() => {
    fetch('/lineups/edc-las-vegas-2025.json')
      .then(res => res.json())
      .then(data => {
        title = data.name;
        artists = data.artists;
      });
  });

  let genreSearchInput = $state('');
  $effect(() => {
    genreSearchInput = localStorage.getItem('genreSearchInput') || '';
  });
  $effect(() => {
    localStorage.setItem('genreSearchInput', genreSearchInput);
  });

  const genreSearch = $derived(genreSearchInput.trim().toLowerCase());
  const filteredArtists = $derived(artists.filter(artist => artist.genres.some(genre => genre.toLowerCase().includes(genreSearch))));
</script>

<svelte:head>
  <title>{title} Lineup</title>
</svelte:head>

<div class="flex">
  <h1 class="text-4xl font-light mb-4 grow">{title}</h1>
  <div class="relative">
    <input type="text" class="mt-0 dark:bg-black dark:border-gray-700 dark:focus:border-gray-500 block w-full border-0 border-b-2 focus:ring-0 focus:border-black" bind:value={genreSearchInput} placeholder="search by genre" />
    <button class="text-gray-500 invisible absolute right-0 px-2 py-3" style="bottom: 13px;" class:invisible={!genreSearchInput} onclick={() => genreSearchInput = ''}>clear</button>
  </div>
</div>

{#each filteredArtists as artist}
  <div class="mb-4">
    <div class="flex gap-2 items-baseline">
      <p class="text-2xl font-light grow">{artist.name}</p>

      <div class="flex flex-wrap gap-2 text-gray-500">
        {#each artist.urls as url}
          <a href={url.url} target="_blank">{url.type}</a>
        {/each}
      </div>
    </div>

    <div class="text-gray-400">
      {#each artist.genres as genre}
        {#if artist.genres.indexOf(genre) === artist.genres.length - 1}
          <Genre genre={genre} genreSearch={genreSearch} />
        {:else}
          <Genre genre={genre} genreSearch={genreSearch} />{', '}
        {/if}
      {/each}
    </div>
  </div>
{/each}

<button class="fixed bottom-4 right-4 bg-gray-200 dark:bg-gray-800 py-1 px-3 rounded-full" onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
  scroll to top
</button>