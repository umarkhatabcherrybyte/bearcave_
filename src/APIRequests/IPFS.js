export function embedGateway(_hash) {
  let str = String(_hash);
  // https://ipfs.io/ipfs//
  let hash = '';
  if (str.toString().startsWith("https://ipfs.io/ipfs//")) {
    hash = str.slice(22);

  }

  else if (str.toString().startsWith("http")) {
    // console.log("got ", _hash, "str is ", str);
    return str;
  }


  else if (str.toString().startsWith("ipfs//")) {
    hash = str.slice(7);
  }

  else if (str.toString().startsWith("ipfs://")) {
    hash = str.slice(7);
  }
  else if (str.toString().startsWith("ipfs:/")) {
    hash = str.slice(6);
  }

  else if (str.toString().startsWith("/ipfs://")) {
    hash = str.slice(8);
  }

  //   console.log("modified hash is", hash);
  let link = "https://ipfs.io/ipfs/" + hash;
  // console.log("got ", _hash, "returning link ", link);

  return link;
}
