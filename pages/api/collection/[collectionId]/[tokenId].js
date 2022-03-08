// import { useRouter } from 'next/router'
// import Moralis from "moralis"
import Moralis from 'moralis/node';

// const serverUrl = process.env.MORALIS_SERVER_URL;
// const appId = process.env.MORALIS_APP_ID;
// Moralis.start({serverUrl, appId});


import { createAlchemyWeb3 } from "@alch/alchemy-web3";
const web3 = createAlchemyWeb3(
  `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
);

export default async function tokenMetadata(req, res) {
  try {
    const collection = req.query.collectionId;
    const tokenId = req.query.tokenId;

    const idMeta = await web3.alchemy.getNftMetadata({
      contractAddress: collection,
      tokenId: tokenId
    });

    const item = {
      contract: idMeta.contract.address,
      description: idMeta.description,
      id: idMeta.id.tokenId,
      uri: idMeta.tokenUri.gateway,
      metadata: idMeta.metadata,
      time: idMeta.timeLastUpdated,
      title: idMeta.title
    }

    item.image = "http://cloudflare-ipfs.com/ipfs/" + item.metadata.image.slice(7);

  
    item.metadata.attributes = item.metadata.attributes.filter(attribute => attribute.value!=="None");
    
    item.faction = item.metadata.attributes.filter(attribute => attribute.trait_type==="Faction")[0].value;
    item.palette = item.metadata.attributes.filter(attribute => attribute.trait_type==="Palette")[0].value.toLowerCase();
    
    item.palette = item.palette.replace(/ +/g, "");
    item.background = 'bg-' + item.palette;

    item.textcolor = (item.palette == 'angel' || 
                      item.palette == 'greenvelvet' || 
                      item.palette == 'taffy' || 
                      item.palette == 'militant' || 
                      item.palette == 'bluepill' ||
                      item.palette == 'silvercharm' || 
                      item.palette == 'whitenight' ||
                      item.palette == 'obedience') ? 'text-white' : 'text-black';

    // const options = { address: collection, token_id: tokenId, chain: "eth" };
    // const tokenIdOwners = await Moralis.Web3API.token.getTokenIdOwners(options);
    // item.owner = tokenIdOwners.result[0].owner_of;
    // console.log(item.owner);

    // fetch("https://api.opensea.io/user/" + item.owner + "?format=json")
    //   .then(res => res.json())
    //   .then(responseJSON => {
    //     item.owner_name = responseJSON.username;
    //     res.status(200).json(item);
    //   });

    item.owner_name = 'PLACEHOLDER';
    res.status(200).json(item);

  }
  catch (err) {
    res.status(500).json({ error: err })
  }
}