import type { BlogComment, BlogPost } from "@/types";

/** Editorial content for `/blog` and `/blog/[id]`. */
export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "How to tell a good leather sole from a bad one",
    slug: "how-to-tell-a-good-leather-sole",
    excerpt:
      "Two soles can look identical on a shelf and behave completely differently after a wet autumn. Here is what to look at before you buy.",
    content: `<p>Almost every shoe in a mid-price shop now claims a "leather sole". The phrase covers everything from a full-thickness vegetable-tanned bend to a paper-thin veneer glued over cardboard, and the difference shows up about four months in.</p>
<h2>Look at the edge, not the face</h2>
<p>Turn the shoe over and look at the side of the sole where it meets the upper. On a properly made shoe you will see distinct layers: the outsole, a welt, and often a thin cork filler between the insole and outsole. If the edge is a single uniform slab with no visible seam, the sole has been cemented on, and when it wears through there is nothing to stitch a new one to.</p>
<h2>Press your thumbnail into it</h2>
<p>Good vegetable-tanned bend is dense. Push a thumbnail into the waist of the sole — the narrow section under the arch — and it should barely mark. If it dents easily, the leather has been over-fatliquored to make it feel supple on the shop floor, and it will compress out of shape within a season.</p>
<h2>Check the heel stack</h2>
<p>Stacked heels should be built from separate leather lifts, and you should be able to count them from the side. A moulded plastic heel painted to look stacked will have a faint seam line running around it where the mould closed.</p>
<h2>Ask whether it can be resoled</h2>
<p>This is the shortest version of the whole test. If the shop cannot tell you that the shoe is Goodyear-welted or Blake-stitched, assume it is glued. A glued shoe is not automatically bad — a lot of very good sneakers are cemented — but it is a shoe with a fixed lifespan, and it should be priced like one.</p>
<p>None of this requires expertise. It requires thirty seconds and a willingness to turn the shoe over in the shop, which is thirty seconds most of us never spend.</p>`,
    image: "https://images.unsplash.com/photo-1554062614-6da4fa67725a?w=900&q=80&auto=format&fit=crop",
    author: "Layla Sarkis",
    category: "Craft",
    tags: ["leather", "construction", "buying guide"],
    date: "18 JUN 2026",
    publishedAt: "2026-06-18T08:00:00.000Z",
    readingMinutes: 6,
    viewCount: 4821,
    commentCount: 3,
    isFeatured: true,
    allowComments: true,
  },
  {
    id: 2,
    title: "Heel height is a lie — platform height is what matters",
    slug: "heel-height-is-a-lie",
    excerpt:
      "A 110mm sandal and an 80mm pump can put your foot at exactly the same angle. The number on the box is not the number that hurts.",
    content: `<p>Every shoe listing gives you a heel height, and almost nobody explains what it means. It is the vertical distance from the ground to the top of the heel at the back. On its own, that number tells you very little about how the shoe will feel.</p>
<h2>The number that matters is the pitch</h2>
<p>What your foot experiences is the difference in height between the heel and the ball of the foot — the pitch, or drop. A 110mm heel sitting on a 30mm platform has a pitch of 80mm. A flat-fronted 80mm pump has a pitch of 80mm. Your ankle cannot tell them apart.</p>
<p>This is why some very tall shoes are surprisingly wearable, and why some modest-looking court shoes are agony. The platform is doing the work, and the listing rarely mentions it.</p>
<h2>What to do with this</h2>
<p>When you compare two pairs, subtract the platform from the heel height on both and compare the results. If a shop does not publish platform height, measure the sole thickness at the widest part of the forefoot with a ruler against the photo — you will get close enough.</p>
<h2>The limits</h2>
<p>Pitch is not the whole story. Heel placement matters: a heel set slightly forward of the back edge moves your centre of mass off the ball of the foot. So does base width. A 70mm stiletto and a 70mm block heel have the same pitch and feel nothing alike after an hour.</p>
<p>But pitch is the single most useful correction to the number on the box, and it is the one nobody makes.</p>`,
    image: "https://images.unsplash.com/photo-1520256862855-398228c41684?w=900&q=80&auto=format&fit=crop",
    author: "Nour Bitar",
    category: "Fit",
    tags: ["heels", "comfort", "fit"],
    date: "02 JUN 2026",
    publishedAt: "2026-06-02T08:00:00.000Z",
    readingMinutes: 5,
    viewCount: 7204,
    commentCount: 2,
    isFeatured: true,
    allowComments: true,
  },
  {
    id: 3,
    title: "A wardrobe of eight pairs",
    slug: "a-wardrobe-of-eight-pairs",
    excerpt:
      "We asked six people who dress for a living which shoes they would keep if they had to cut down to eight. The overlap was striking.",
    content: `<p>The premise was deliberately annoying: eight pairs, no exceptions, must cover work, weekends, weather and one formal event a year. Six people answered. Five of the eight slots came out nearly identical.</p>
<h2>The five everyone kept</h2>
<p>A dark leather ankle boot. A white or off-white leather sneaker. A flat sandal with real arch support. A mid-height block heel in black. And — this one surprised us — a loafer, chosen over a ballet flat by five out of six on the grounds that it holds a shape.</p>
<h2>Where they diverged</h2>
<p>The remaining three slots split along climate and commute. The two who walk more than four kilometres a day both spent a slot on a second sneaker, a cushioned one, so the leather pair could stay clean. The two in wetter cities spent a slot on rubber. Only one kept a stiletto, and she noted she wears it perhaps five times a year and would not give up the slot.</p>
<h2>What nobody kept</h2>
<p>Nobody kept a mule. Nobody kept a knee-high boot, though three said they would want one if the limit were ten. And nobody kept anything bought in the previous six months, which is either a comment on newness or on how long it takes to know whether a shoe is actually good.</p>
<h2>The useful conclusion</h2>
<p>If you are building from nothing, the five-pair core is a genuinely defensible starting point, and it costs less than most people's single impulse purchase of the year.</p>`,
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?w=900&q=80&auto=format&fit=crop",
    author: "Layla Sarkis",
    category: "Style",
    tags: ["capsule", "wardrobe", "essentials"],
    date: "21 MAY 2026",
    publishedAt: "2026-05-21T08:00:00.000Z",
    readingMinutes: 7,
    viewCount: 9612,
    commentCount: 4,
    isFeatured: true,
    allowComments: true,
  },
  {
    id: 4,
    title: "What actually happens in the Damascus workshop",
    slug: "inside-the-damascus-workshop",
    excerpt:
      "Eleven people, four sewing machines, one very old clicking press. A walk through how an Atelier pair gets made.",
    content: `<p>The Magic Show Atelier line is made in a workshop of eleven people in the Bab Sharqi quarter. It is not a factory and it does not pretend to be. Here is what a pair passes through.</p>
<h2>Clicking</h2>
<p>Hides arrive whole and are cut by hand against steel dies on a press that has been in the room longer than anyone working it. The cutter reads the hide first — looking for stretch direction, healed scars, thin bellies — and lays the dies so the vamp comes from the tight back of the hide where it will not stretch out of shape.</p>
<h2>Closing</h2>
<p>Panels are skived at the edges so overlapping seams do not create a ridge inside the shoe, then stitched. Four machines, three closers. A simple pump is maybe twenty minutes; the Halden knee-high, with its elastic gusset and hidden back seam, takes over an hour.</p>
<h2>Lasting</h2>
<p>The upper is pulled over a wooden last and tacked down. This is the step that decides whether a shoe fits, and it is the hardest to teach. Our laster has been doing it for twenty-six years and still measures every pair against a template rather than trusting his eye.</p>
<h2>Finishing</h2>
<p>Edges are inked, burnished, and waxed. Socks are stamped and glued. Then the shoes rest on the last for at least forty-eight hours before they are pulled, which is the step most volume manufacturers skip and the reason cheap shoes lose their shape in the box.</p>
<p>Total: about four days per pair, most of it waiting.</p>`,
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=900&q=80&auto=format&fit=crop",
    author: "Farid Chalhoub",
    category: "Craft",
    tags: ["atelier", "making", "behind the scenes"],
    date: "07 MAY 2026",
    publishedAt: "2026-05-07T08:00:00.000Z",
    readingMinutes: 6,
    viewCount: 3388,
    commentCount: 2,
    isFeatured: false,
    allowComments: true,
  },
  {
    id: 5,
    title: "Caring for suede without ruining it",
    slug: "caring-for-suede",
    excerpt:
      "Most suede is killed by good intentions. The rules are shorter than you think, and one of them is to do nothing.",
    content: `<p>Suede has a reputation for being fragile that it does not entirely deserve. What it is, is unforgiving of the wrong intervention. Four rules cover almost everything.</p>
<h2>1. Protect it before you wear it, once</h2>
<p>A fluoropolymer-free protector spray, applied evenly from about 20cm, before the first wear. One coat. Let it dry for a full day. Re-apply once a season, not once a month — build-up flattens the nap far faster than dirt does.</p>
<h2>2. When it gets wet, do nothing</h2>
<p>Do not rub it. Do not put it near a radiator. Stuff the shoe with newspaper to hold its shape and leave it somewhere with moving air at room temperature. When it is fully dry — and only then — brush the nap back up with a suede brush, always in one direction.</p>
<h2>3. For marks, use an eraser first</h2>
<p>A crepe rubber suede eraser will lift most scuffs and shiny patches. Work gently and in one direction. Reach for liquid cleaners only when the eraser has genuinely failed, because most of them will lift colour along with the mark.</p>
<h2>4. Salt is the real enemy</h2>
<p>Road salt draws moisture out of the leather and leaves a white tidemark that is very hard to remove once it has set. If you walk on salted pavement, wipe the shoes down with a barely damp cloth the same evening. This is the one case where prompt action beats patience.</p>
<p>That is the whole method. Everything else sold for suede care is optional at best.</p>`,
    image: "https://images.unsplash.com/photo-1465453869711-7e174808ace9?w=900&q=80&auto=format&fit=crop",
    author: "Nour Bitar",
    category: "Care",
    tags: ["suede", "care", "maintenance"],
    date: "16 APR 2026",
    publishedAt: "2026-04-16T08:00:00.000Z",
    readingMinutes: 4,
    viewCount: 12045,
    commentCount: 3,
    isFeatured: true,
    allowComments: true,
  },
  {
    id: 6,
    title: "Why we stopped publishing a size chart",
    slug: "why-we-stopped-publishing-a-size-chart",
    excerpt:
      "A single chart across forty-four products was quietly making our returns worse. Here is what replaced it.",
    content: `<p>For two years the site carried one size chart covering every product. It mapped EU sizes to centimetres and it was, in the narrow sense, accurate. It was also responsible for a measurable share of our returns.</p>
<h2>The problem with one chart</h2>
<p>Shoes are built on lasts, and a last is not a size. Our pointed stiletto last and our round-toe boot last both take a "38" foot, but the stiletto needs 4mm more length in front of the toes to look right, and the boot needs 3mm more girth to take a thick sock. Publishing a single conversion table told customers those two shoes fit identically. They do not.</p>
<h2>What we do now</h2>
<p>Every product page carries a fit note written by the person who lasted it: whether it runs long or short, whether the width is generous, what to do if you are between sizes. It is three sentences and it is specific to that one shoe.</p>
<p>We also publish the internal length of the actual size 38 sample for each style, measured heel to toe with a Brannock rule, so you can compare against a shoe you already own and trust.</p>
<h2>What changed</h2>
<p>Size-related returns fell by just over a third in the first two quarters. The fit notes take our team about twenty minutes per style to write. It is the cheapest improvement we have made.</p>
<h2>The uncomfortable part</h2>
<p>It also means we can no longer tell you your size. We can only tell you how a specific shoe behaves relative to itself. That is less satisfying, and it is closer to true.</p>`,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=900&q=80&auto=format&fit=crop",
    author: "Farid Chalhoub",
    category: "Fit",
    tags: ["sizing", "returns", "transparency"],
    date: "29 MAR 2026",
    publishedAt: "2026-03-29T08:00:00.000Z",
    readingMinutes: 5,
    viewCount: 5470,
    commentCount: 2,
    isFeatured: false,
    allowComments: false,
  },
  {
    id: 7,
    title: "Five bags, tested with a real commute",
    slug: "five-bags-tested-with-a-real-commute",
    excerpt:
      "We carried each of our five bags for a full working week — laptop, lunch, umbrella, the lot — and wrote down what broke.",
    content: `<p>Product photography flatters bags. A week of actual use does not. Each of the five bags in the current range was carried by a member of the team for five consecutive working days with the same contents: a 14-inch laptop, a notebook, a 500ml bottle, an umbrella, keys, and a lunch box.</p>
<h2>Lucerne Structured Tote</h2>
<p>The only bag that took everything without complaint. The suspended sleeve did its job — no corner marks on the laptop after five days. Shoulder straps dug in slightly when fully loaded; we are widening them 8mm for the next run.</p>
<h2>Sena Woven Tote</h2>
<p>Handled the load fine but the open top is a real limitation in rain. Beautiful after five days of handling — the weave had already started to darken at the handles.</p>
<h2>Perla Bucket Bag</h2>
<p>Everything fit, nothing could be found. The removable pouch helps but the drawstring means one-handed access is not happening. Best as a weekend bag.</p>
<h2>Fen Crossbody and Tamsin Mini</h2>
<p>Both failed the test, by design. Neither takes a laptop and neither claims to. Reported here for completeness: the Fen carried a phone, cards and keys for five days without the strap slipping once, which is the actual job.</p>
<h2>What we changed</h2>
<p>Strap width on the Lucerne, and a small rain flap on the Sena that we are still prototyping. Everything else stays.</p>`,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&q=80&auto=format&fit=crop",
    author: "Layla Sarkis",
    category: "Reviews",
    tags: ["bags", "testing", "commute"],
    date: "11 MAR 2026",
    publishedAt: "2026-03-11T08:00:00.000Z",
    readingMinutes: 6,
    viewCount: 2916,
    commentCount: 1,
    isFeatured: false,
    allowComments: true,
  },
];

export const blogPostById = new Map(blogPosts.map((post) => [post.id, post]));

/** Approved comments, threaded one level deep. */
export const blogComments: BlogComment[] = [
  {
    id: 1,
    postId: 1,
    parentId: null,
    author: "Georges Antoun",
    authorEmail: "g.antoun@example.com",
    content:
      "The thumbnail test is the one I never knew about. Tried it on three pairs in my own wardrobe and it sorted them immediately.",
    date: "19 JUN 2026",
    createdAt: "2026-06-19T10:24:00.000Z",
    isApproved: true,
    replies: [
      {
        id: 2,
        postId: 1,
        parentId: 1,
        author: "Layla Sarkis",
        authorEmail: "layla@magicshow.example",
        content:
          "Glad it helped. Worth doing on the waist rather than the ball of the foot — the waist is where manufacturers cut thickness first.",
        date: "19 JUN 2026",
        createdAt: "2026-06-19T13:02:00.000Z",
        isApproved: true,
        replies: [],
      },
    ],
  },
  {
    id: 3,
    postId: 1,
    parentId: null,
    author: "Suzanne Melki",
    authorEmail: "s.melki@example.com",
    content:
      "Would love a follow-up on how to find a good cobbler. Knowing a shoe can be resoled is only useful if someone near you can do it.",
    date: "22 JUN 2026",
    createdAt: "2026-06-22T08:47:00.000Z",
    isApproved: true,
    replies: [],
  },
  {
    id: 4,
    postId: 2,
    parentId: null,
    author: "Dana Riachi",
    authorEmail: "d.riachi@example.com",
    content:
      "This explains why my 'sensible' 60mm courts are worse than my 100mm platforms. I have been blaming my feet for years.",
    date: "03 JUN 2026",
    createdAt: "2026-06-03T09:15:00.000Z",
    isApproved: true,
    replies: [],
  },
  {
    id: 5,
    postId: 2,
    parentId: null,
    author: "Karim Boustani",
    authorEmail: "k.boustani@example.com",
    content:
      "Good piece. A note on heel placement in a future article would round it out — that is the variable I still cannot predict from photos.",
    date: "05 JUN 2026",
    createdAt: "2026-06-05T16:38:00.000Z",
    isApproved: true,
    replies: [],
  },
  {
    id: 6,
    postId: 3,
    parentId: null,
    author: "Rita Abou Jaoude",
    authorEmail: "r.aboujaoude@example.com",
    content:
      "The loafer-over-flat result matches my experience exactly. Flats look tired after a season; loafers look worn in.",
    date: "23 MAY 2026",
    createdAt: "2026-05-23T11:20:00.000Z",
    isApproved: true,
    replies: [],
  },
  {
    id: 7,
    postId: 3,
    parentId: null,
    author: "Elias Traboulsi",
    authorEmail: "e.traboulsi@example.com",
    content: "Curious what the sixth person kept in the slot everyone else spent on rubber.",
    date: "24 MAY 2026",
    createdAt: "2026-05-24T14:55:00.000Z",
    isApproved: true,
    replies: [
      {
        id: 8,
        postId: 3,
        parentId: 7,
        author: "Layla Sarkis",
        authorEmail: "layla@magicshow.example",
        content: "A second pair of the same ankle boot. She said she rotates them daily and it doubles their life.",
        date: "25 MAY 2026",
        createdAt: "2026-05-25T09:10:00.000Z",
        isApproved: true,
        replies: [],
      },
    ],
  },
  {
    id: 9,
    postId: 4,
    parentId: null,
    author: "Hiba Zeidan",
    authorEmail: "h.zeidan@example.com",
    content:
      "The forty-eight hours on the last is fascinating. Is that why the Atelier pairs arrive so much crisper than the others?",
    date: "09 MAY 2026",
    createdAt: "2026-05-09T12:05:00.000Z",
    isApproved: true,
    replies: [
      {
        id: 10,
        postId: 4,
        parentId: 9,
        author: "Farid Chalhoub",
        authorEmail: "farid@magicshow.example",
        content: "Largely, yes. It is the cheapest step to skip and the most visible one when you do.",
        date: "10 MAY 2026",
        createdAt: "2026-05-10T08:30:00.000Z",
        isApproved: true,
        replies: [],
      },
    ],
  },
  {
    id: 11,
    postId: 5,
    parentId: null,
    author: "Marwan Sayegh",
    authorEmail: "m.sayegh@example.com",
    content: "Ruined a pair of suede boots with a radiator last winter. Wish I had read rule two in October.",
    date: "17 APR 2026",
    createdAt: "2026-04-17T18:12:00.000Z",
    isApproved: true,
    replies: [],
  },
  {
    id: 12,
    postId: 5,
    parentId: null,
    author: "Joelle Kassab",
    authorEmail: "j.kassab@example.com",
    content:
      "Any brand recommendation for the eraser? The one I have leaves crumbs that stick in the nap.",
    date: "20 APR 2026",
    createdAt: "2026-04-20T07:44:00.000Z",
    isApproved: true,
    replies: [
      {
        id: 13,
        postId: 5,
        parentId: 12,
        author: "Nour Bitar",
        authorEmail: "nour@magicshow.example",
        content:
          "Crumbs are normal — brush them out afterwards with a brass-bristle brush. If they smear rather than crumb, the eraser is too soft.",
        date: "21 APR 2026",
        createdAt: "2026-04-21T10:00:00.000Z",
        isApproved: true,
        replies: [],
      },
    ],
  },
  {
    id: 14,
    postId: 6,
    parentId: null,
    author: "Tania Frem",
    authorEmail: "t.frem@example.com",
    content:
      "More brands should do this. The internal-length measurement is the single most useful number on any shoe page.",
    date: "31 MAR 2026",
    createdAt: "2026-03-31T15:26:00.000Z",
    isApproved: true,
    replies: [],
  },
  {
    id: 15,
    postId: 6,
    parentId: null,
    author: "Bassel Nahas",
    authorEmail: "b.nahas@example.com",
    content: "A third fewer size returns is a big number. Did average order value move at all?",
    date: "02 APR 2026",
    createdAt: "2026-04-02T09:03:00.000Z",
    isApproved: true,
    replies: [],
  },
  {
    id: 16,
    postId: 7,
    parentId: null,
    author: "Nadine Kanaan",
    authorEmail: "n.kanaan@example.com",
    content:
      "Appreciate a brand publishing what did not work. The strap-width fix is exactly the note I would have sent you.",
    date: "13 MAR 2026",
    createdAt: "2026-03-13T13:41:00.000Z",
    isApproved: true,
    replies: [],
  },
];
