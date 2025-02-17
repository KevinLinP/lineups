import fs from 'fs/promises';
import path from 'path';
import OpenAI from 'openai';
import { decode } from 'html-entities';
import TurndownService from 'turndown';
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import _ from 'lodash';

const SLEEP_TIME = 1000;

const openRouter = new OpenAI({
  base_url: "https://openrouter.ai/api/v1",
  api_key: process.env.OPENROUTER_API_KEY,
});

const turndown = new TurndownService();

const response_format = zodResponseFormat(
  z.object({
    genres: z.array(z.string()),
  }),
  "genres"
);

async function processArtistBios() {
  // Read all files in the artist-bios directory
  const biosDir = path.join(process.cwd(), 'data/edc-lv-2025/artist-bios');
  const outputDir = path.join(process.cwd(), 'data/edc-lv-2025/artist-genres');

  const files = await fs.readdir(biosDir);
  let jsonFiles = files.filter(file => file.endsWith('.json'));
  // jsonFiles = _.sampleSize(jsonFiles, 1);

  for (const file of jsonFiles) {
    try {
      // Check if output file already exists
      const outputPath = path.join(outputDir, file);
      const fileExists = await fs.stat(outputPath).then(() => true).catch(() => false);
      
      if (fileExists) {
        console.log(`Skipping ${file} - already processed`);
        continue;
      }

      // Read and parse the JSON file
      const content = await fs.readFile(path.join(biosDir, file), 'utf-8');
      const artistData = JSON.parse(content);
      
      if (!artistData.data?.[0]) continue;
      
      const { name, post_content } = artistData.data[0];
      
      // Convert HTML to markdown and decode HTML entities
      const cleanBio = turndown.turndown(decode(post_content));

      // Create prompt for OpenAI
      const prompt = `What genres of electronic music does the artist named ${name} play? Please do use outside knowledge, but I've also included a bio below to help. 

${cleanBio}`;

      // Get response from OpenAI
      const response = await openRouter.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        response_format
      });

      console.log(response.choices[0].message.content);

      // Create output object
      const genreData = {
        name,
        cleanBio,
        genres: JSON.parse(response.choices[0].message.content).genres
      };

      // Save to output file
      await fs.writeFile(outputPath, JSON.stringify(genreData, null, 2));
      
      console.log(`Processed ${name}`);
      
      // Add a small delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, SLEEP_TIME));
      
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }
}

processArtistBios().catch(console.error);
