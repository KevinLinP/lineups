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
</script>

<svelte:head>
  <title>{title} - Lineup</title>
</svelte:head>

<h1 class="text-4xl font-light mb-4">{title}</h1>

{#each artists as artist}
  <div class="mb-4">
    <div class="flex gap-2 items-baseline">
      <p class="text-2xl font-light flex-grow-1">{artist.name}</p>

      <div class="flex flex-wrap gap-2 text-gray-500">
        {#each artist.urls as url}
          <a href={url.url} target="_blank">{url.type}</a>
        {/each}
      </div>
    </div>

    <p class="text-gray-400 text-lg">{artist.genres.join(', ')}</p>
  </div>
{/each}
