<p align="center">
<picture>
    <source media="(prefers-color-scheme: dark)" srcset="img/Xbox.svg">
    <source media="(prefers-color-scheme: light)" srcset="img/Xbox.svg">
    <img src="img/Xbox.svg" style="width: 40%; height: 40%;" alt="X-Box logo">
</picture>
<br>

<a href="https://x.com/Xenopus_v1"><img src="https://img.shields.io/twitter/follow/Xenopus_v1?style=social" alt="Follow on X" /></a>
&nbsp;
<a href="https://huggingface.co/Xeno-nim"><img src="https://img.shields.io/badge/🤗_Hugging_Face-Xeno--nim-ffca28?style=flat" alt="Hugging Face" /></a>
&nbsp;
<a href="https://xenobots.tech"><img src="https://img.shields.io/badge/📝_Blog-Introducing_X--Box-20FF49?style=flat" alt="Blog Site" /></a>

<br>
</p>
&nbsp;

# X-Box: Data Fine-Tuning Framework

X-Box is a dedicated framework designed to streamline LLM fine-tuning for creating highly personalized conversational agents. Our framework provides an end-to-end solution for developing fine-tuned AI agents with a focus on social interaction capabilities.

## ✨ Create your first Xenobot model for free

We designed all demos and notebooks to be **beginner friendly**! All you need to do is produce your own dataset, add it to the notebook, and get a ready-to-use model.

| Demo | Data Prep | Free Notebooks | Model |
|------|-----------|----------------|-------|
| **Xenobot Bully** | [Data Demo](https://github.com/Nim-Network-Foundation/X-box/tree/main/Bully-demo) | [▶️ Try for free](https://colab.research.google.com/drive/1l1bt_YAQj5fo2eRfx5QGgdR8F70W7JzM?usp=sharing) | Llama 3.1 Instruct(8B) |

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nim-Network-Foundation/X-box
   cd X-box
   cd Bully-demo

   ```

2. **Configure Your Brand** 
   Edit `run.js` with your details:
   ```javascript
   const { DatasetConfig, TweetDatasetProcessor } = require('./tweet_dataset_processor');

   const config = new DatasetConfig({
       // 🎨 YOUR BRAND IDENTITY HERE
       tickerSymbol: '<YOUR_TICKER_SYMBOL>',           // Your token symbol
       twitterHandle: '<YOUR_TWITTER_HANDLE>',  // Your Twitter handle (no @)
       
       // 📁 Data paths (usually leave as default)
       inputMainTweetsPath: '../data/raw-data/bully/Bully_full.json',
       inputPairsPath: '../data/raw-data/bully/bully_pairs_5000.json',
       outputPath: 'datasets',
       
       // 🎯 Customize agent personality
       systemPrompts: {
           mainTweets: "You're Xenobot a funny AI agent that control a twitter account under the username {twitterHandle}, roast and make fun of people, make sure you're funny and unhinged.",
           replies: "You're Xenobot a funny AI agent that control a twitter account under the username {twitterHandle}, roast and make fun of people tagging you on X/twitter, make sure you're funny and unhinged."
       }
   });

   // 🚀 Run the processor
   const processor = new TweetDatasetProcessor(config);
   processor.process().catch(error => {
       console.error('Error:', error);
       process.exit(1);
   });
   ```

3. **Run the Processor**
   ```bash
   node run.js
   ```

## 🚀 OpenAI Fine-tuning

This project now supports direct fine-tuning with OpenAI's API. To use this feature:

1. **Set up your environment**
   ```bash
   cp .env.example .env
   # Edit .env with your OpenAI API key and configuration
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Prepare your dataset**
   ```bash
   npm run prepare-data
   ```

4. **Start fine-tuning**
   ```bash
   npm run finetune
   ```

### Fine-tuning Configuration

Adjust these parameters in your `.env` file:

- `MODEL_NAME`: Base model to fine-tune (e.g., 'gpt-4')
- `MAX_TOKENS`: Maximum tokens per response
- `TEMPERATURE`: Response creativity (0.0-1.0)
- `BATCH_SIZE`: Training batch size
- `N_EPOCHS`: Number of training epochs

## 🚀 Core Features

### End-to-End Pipeline
- **Raw Data Collection**: Robust tools for gathering training data
- **Dataset Formatting**: Automated conversion to fine-tuning ready formats (SFT)
- **Model Training**: Integrated provider support with customizable parameters
- **Inference Engine**: Dedicated system for social interaction deployment(**soon**)

### Available Resources

#### X-Model Library
Our curated collection of pre-trained models:
| Model Name | Description | Repository | In-Production Example |
|------------|-------------|------------|---------------------|
| Xenobot Truth Terminal | A fine-tuned model based on [Truth Terminal](https://x.com/truth_terminal) | [Repository](https://github.com/Nim-Network-Foundation/X-box/tree/main/models/Xenobot-Truth-Terminal) | [Tweet](https://x.com/Natan_benish/status/1869667371650355472) |
| Xenobot Bully | A Xenbot agent designed to roast users on X | [Repository](https://github.com/Nim-Network-Foundation/X-box/tree/main/models/Xenbot-Bully) | [Tweet](https://x.com/Xenopus_v1/status/1873172088724340910) |
| 4chan-crypto | A model designed on longer context conversation on the 4chan board discussing crypto related topics | [Repository](https://github.com/Nim-Network-Foundation/X-box/tree/main/models/4chan-crypto) | - |

#### X-Data Resources
| Category | Description |
|----------|-------------|
| Raw Data | Includes mostly raw data sources ready to be formatted into fine-tuning datasets |
| Datasets | Ready to use fine-tuning datasets |

## 🔮 Upcoming Features

### Current Development
- **Hugging Face Integration**
  Advanced repository management with runtime dataset and model loading

- **X Archive Model Demo**
  Create personalized digital clones using X/Twitter archive exports

- **Mini-Scraper**
  Efficient data collection combining cookie-based scraping with Twitter API integration

- **Serapex V1**
  Curated dataset index organized by:
  - Character/Persona profiles
  - Behavioral traits
  - Knowledge domains

- **X-Bot**
  Secure API integration for policy-compliant agent deployment

- **Hyperparameter Optimizer**
  Smart configuration toolkit optimizing for:
  - Use case requirements
  - Dataset size
  - Available resources

- **Synthetic Data Engine**
  Advanced data enhancement system for:
  - Limited dataset enrichment
  - Custom data generation
  - A/B testing capabilities

### Features Considered on the Roadmap
| Feature | Description |
|---------|-------------|
| Blockmesh API Integration | To enable builders to use high-quality data stream |
| Fine-tuned Image Models | Powered by our [meme-maker](https://memeticmaker.com) |
| DPO Support | Will unlock highly nuanced model training |
| Chat App Template | One-click deployment of created model with chat app for testing |
| Inference and Training Hosting | Enabling easier deployment of models with in-house hosting or with providers |

## 📚 Documentation & Demos
Get started with our practical guides and tutorials:
- [Bully Demo Tutorial](https://github.com/Nim-Network-Foundation/X-box/tree/main/Bully-demo)
- Comprehensive documentation (coming soon)
- Interactive examples and use cases
