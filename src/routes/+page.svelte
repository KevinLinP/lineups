<script>
  let artists = $state([]);

  $effect(() => {
    fetch('/lineups/edc-las-vegas-2025.json')
      .then(res => res.json())
      .then(data => {
        artists = data.artists;
      });
  });
</script>

{#each artists as artist}
  <div class="mb-4">
    <h1>{artist.name}</h1>
    <p>{artist.genres.join(', ')}</p>
    {#each artist.urls as url}
      <a href={url.url} target="_blank">{url.type}</a>
    {/each}
  </div>
{/each}
