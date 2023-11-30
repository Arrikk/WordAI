const fs = require('fs')
const dotenv = require('dotenv')
const path = require('path')
// const { OpenAI } = require("langchain/llms/openai");
const {OpenAI} = require('langchain/llms/openai')
// const {RetrievalQAChain} = require('langchain/chains'
// const {} = require('langchain/vectorstores'
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
// const { fileURLToPath } = require('url';
const {RecursiveCharacterTextSplitter } = require('langchain/text_splitter')
const { HNSWLib } = require("langchain/vectorstores/hnswlib")
const { RetrievalQAChain } = require("langchain/chains")


dotenv.config();
const fileName = 'doc'
const question = '4.15 Total disability ratings'
const filePath = path.join(__dirname, `${fileName}.txt`)
const VECTOR_STORE_PATH = `${fileName}.index`

 const runEmbeddigs = async () => {
    const model = new OpenAI({openAIApiKey: process.env.OPEN_AI_KEY})
    const Embedding = new OpenAIEmbeddings({openAIApiKey: process.env.OPEN_AI_KEY})
    let vectorStore;
    if(fs.existsSync(VECTOR_STORE_PATH)){
        console.log("Vector Exists")
        vectorStore = await HNSWLib.load(VECTOR_STORE_PATH, Embedding)
    }else{
        const text = fs.readFileSync(filePath, 'utf8')
        const textSplitter = new RecursiveCharacterTextSplitter({chunkSize: 1000})
        const docs = await textSplitter.createDocuments([text])
        vectorStore = await HNSWLib.fromDocuments(docs, Embedding)
        await vectorStore.save(VECTOR_STORE_PATH)
        // console.log(docs);
    }

    const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever())
    const res = await chain.call({
        query: question,
    })

    console.log(res)

}

runEmbeddigs().catch(e => console.error(e))