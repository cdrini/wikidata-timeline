angular.module('wikidataTimeline')

.factory('$sparqlSamples', [function() {
  var samples = [
    {
      title: 'Former Countries',
      sparql: `
SELECT DISTINCT ?item ?itemLabel (min(?start) as ?start) (min(?end) as ?end) WHERE {
?item wdt:P31/wdt:P279* wd:Q3024240;
      wdt:P571 ?start;
      wdt:P576 ?end.
FILTER(!isBlank(?start) && !isBlank(?end))
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
} GROUP BY ?item ?itemLabel`.trim(),
      widthOfYear: 1
    },
    {
      title: 'American Sitcoms',
      sparql: `
SELECT DISTINCT ?item ?itemLabel (min(?start) as ?start) (min(?end) as ?end) WHERE {
  ?item wdt:P31/wdt:P279* wd:Q5398426;
        wdt:P495 wd:Q30;
        wdt:P136 wd:Q170238;
        wdt:P580 ?start.
  OPTIONAL { ?item wdt:P582 ?end. }
  FILTER(!isBlank(?start))
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
} GROUP BY ?item ?itemLabel`.trim()
    },
    {
      title: 'US Presidents',
      sparql: `
SELECT ?item ?itemLabel ?start ?end WHERE {
  wd:Q30  p:P6 ?statement.
  ?statement ps:P6 ?item;
              pq:P580 ?start.
  OPTIONAL { ?statement pq:P582 ?end }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}`.trim(),
      widthOfYear: 10
    },
    {
      title: 'Wars',
      sparql: `
SELECT DISTINCT ?item ?itemLabel (min(?start) as ?start) (min(?end) as ?end) WHERE {
  ?item wdt:P31/wdt:P279* wd:Q198;
        wdt:P580 ?start.
  OPTIONAL { ?item wdt:P582 ?end. }
  FILTER(!isBlank(?start))
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
} GROUP BY ?item ?itemLabel`.trim(),
      widthOfYear: 1
    },
    {
      title: 'Empires',
      sparql: `
SELECT DISTINCT ?item ?itemLabel (min(?start) as ?start) (min(?end) as ?end) WHERE {
  ?item wdt:P31 wd:Q48349;
        wdt:P580|wdt:P571 ?start.
  OPTIONAL { ?item wdt:P582|wdt:P576 ?end. }
  FILTER(!isBlank(?start))
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
} GROUP BY ?item ?itemLabel
`,
      widthOfYear: 1
    },
    {
      title: 'Meryl Streep',
      sparql: `
SELECT ?item ?itemLabel (min(?start) as ?start) (min(?end) as ?end) WHERE {
  BIND(wd:Q873 as ?actor)

  {
    # Life span
    BIND(?actor as ?item)
    ?actor wdt:P569 ?start.
    OPTIONAL { ?actor wdt:P570 ?end. }
  } UNION {
    # Films starred in
    ?item wdt:P31/wdt:P279* wd:Q11424;
          wdt:P161 ?actor;
          wdt:P577 ?start.
    BIND(?start as ?end)
  } UNION {
    # TV Shows
    ?item wdt:P31/wdt:P279* wd:Q5398426;
          wdt:P161 ?actor;
          wdt:P580 ?start.
    OPTIONAL { ?item wdt:P582 ?end }
  }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
} GROUP BY ?item ?itemLabel`.trim()
    },
    {
      title: 'Charlie Chaplin',
      sparql: `
SELECT ?item ?itemLabel (min(?start) as ?start) (min(?end) as ?end) WHERE {
  BIND(wd:Q882 as ?actor)

  {
    # Life span
    BIND(?actor as ?item)
    ?actor wdt:P569 ?start.
    OPTIONAL { ?actor wdt:P570 ?end. }
  } UNION {
    # Films starred in
    ?item wdt:P31/wdt:P279* wd:Q11424;
          wdt:P161 ?actor;
          wdt:P577 ?start.
    BIND(?start as ?end)
  } UNION {
    # TV Shows
    ?item wdt:P31/wdt:P279* wd:Q5398426;
          wdt:P161 ?actor;
          wdt:P580 ?start.
    OPTIONAL { ?item wdt:P582 ?end }
  }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
} GROUP BY ?item ?itemLabel`.trim()
    },
    {
      title: 'Jules Verne',
      sparql: `
SELECT ?item ?itemLabel (min(?start) as ?start) (min(?end) as ?end) WHERE {
  BIND(wd:Q33977 as ?author)

  {
    # Life span
    BIND(?author as ?item)
    ?author wdt:P569 ?start.
    OPTIONAL { ?author wdt:P570 ?end. }
  } UNION {
    # Works written
    ?item wdt:P50 ?author;
          wdt:P577 ?start.
    BIND(?start as ?end)
    FILTER(!isBlank(?start))
    FILTER NOT EXISTS { ?item wdt:P31 wd:Q3331189. }
  }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
} GROUP BY ?item ?itemLabel`.trim(),
      widthOfYear: 10
    }
  ];

  function toUrl(sample) {
    var result = "";
    for(var name in sample) {
      result += '&' + name + '=' + encodeURIComponent(sample[name]);
    }

    return result.length ? result.slice(1) : "";
  }

  samples = samples.map(function(sample) {
    sample.urlComponents = toUrl(sample);
    return sample;
  });

  var api = {};
  api.getSamples = function() {
    return samples;
  };

  return api;
}]);
