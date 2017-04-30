# olemak.github.io
Olemak's personal website. Changes a lot, will usually contain tech demos; maybe a blog at some point.

## Right now, it's a poetry generator!

I found out that The Norwegian Broadcasting Corporation has an open API for all their subtitles, and they subtitle _everything_.
So I figured I could grab a few subtitles and mess with them to make a cutup-style pseudo-poetry generator.

Furthermore, it uses React.js to display the poems and also to switch between different subtitle sources (programmes).
Naturally, the results are very different for a teen drama like "Skam" ("Shame") or a nature show.

It's all in Norwegian, I mostly did this for fun and learning; I could add more sources and more programmes to the select list at the top of the page, but I don't think that's going to happen.

## Controls
There are two UI elements: a reload icon and a drop-down list.
__The Reload Icon__ will compose a new poem from the subtitles already fetched from NRK.
__The Dropdown__ will fetch subtitles for another show and make a poem based on that.

## Room for improvement
Some features that could be added or expanded, are:
* __Cached subtitles__. Each time a new show/programme is selected, the old subtiles are simpluy replaced by new ones piped in with ajax magic. I could potentially preserve the old subtitles if the current methor represents a load on server resources. 
* __Saved poems__. These fleeting lines are not saved anywhere; I could have made a persistant system that also allowed link sharing to twitter, facebook et cetera, but I dont think anyone one use it. Besides, I like the fleeting nature of the "poems".
* __Editable poems__. Lines could be reorderable and deletable, and the text could be editable. 
* __More sources__. I could quite easily add more programmes/series, and also make it possible to choose between seasons and episodes for each supported show. It would make the UI more complicated, though, and for a fun little thing like this it's not exactly  _neccecary_. 

## Browser support
Tested in Chrome, Firefox and Internet Explorer; other browsers should be OK as long as they're not known for iffy javascript implementations.
One caveat for__Internet Explorer__: The NRK subtitles are grabbed from an XML-like format (TTF: Timed Text Format) and parsed, meaning that each paragraph appears as a virtual DOM node at the time of processing, and can be console logged as such. Most browsers will gladly grab the innerHTML of virtual nodes - but not our special friend Internet Explorer. IE will only grab the innerHTML from actual, rendered DOM nodes. So for IE, I had to use the property textContent instead. This is not optimal, because the textContent will simply cut break tags and not replace them with a space. I guess I could, in a loop, create a node for each subtitle element, add it to the DOM, grab the innerHTML of it and then destroy the node again. It would be a pretty hard hit to performance, and in my opinion it is not worth it, so for this simple demo I'll chalk it up to "(semi-)graceful detoriation".

So in IE (and other browsers that act like it) longer text elements will usually have two words mashed together without dividing whitespace. 
