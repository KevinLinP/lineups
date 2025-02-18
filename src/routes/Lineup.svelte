<script>
  import ArtistLinks from './ArtistLinks.svelte';

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
  <div>
    <input type="text" class="mt-0 dark:bg-black dark:border-gray-700 dark:focus:border-gray-500 block w-full border-0 border-b-2 focus:ring-0 focus:border-black" bind:value={genreSearchInput} placeholder="search by genre" />
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

    <p class="text-gray-400 text-lg">{artist.genres.join(', ')}</p>
  </div>
{/each}
