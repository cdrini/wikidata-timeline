'use strict';

angular.module('wikidataTimeline.samplesView', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/samples', {
    templateUrl: 'samplesView/samplesView.html',
    controller: 'SamplesViewCtrl'
  });
}])

.controller('SamplesViewCtrl', [function() {
  var format = d3.time.format("%d/%m/%Y");
  var items = [
  	{
  	  name: "The Simpsons",
  	  start: format.parse('17/12/1989'),
  	  end: format.parse('')
  	},
  	{
  	  name: "Two and a Half Men",
  	  start: format.parse('22/09/2003'),
  	  end: format.parse('')
  	},
  	{
  	  name: "2 Broke Girls",
  	  start: format.parse('19/09/2011'),
  	  end: format.parse('')
  	},
  	{
  	  name: "Last Man Standing",
  	  start: format.parse('11/10/2011'),
  	  end: format.parse('')
  	},
  	{
  	  name: "Save Me",
  	  start: format.parse('23/05/2013'),
  	  end: format.parse('')
  	},
  	{
  	  name: "The Big Bang Theory",
  	  start: format.parse('24/09/2007'),
  	  end: format.parse('')
  	},
  	{
  	  name: "Arrested Development",
  	  start: format.parse('02/11/2003'),
  	  end: format.parse('')
  	},
  	{
  	  name: "Modern Family",
  	  start: format.parse('23/09/2009'),
  	  end: format.parse('')
  	},
  	{
  	  name: "Curb Your Enthusiasm",
  	  start: format.parse('15/10/2000'),
  	  end: format.parse('')
  	},
  	{
  	  name: "The Mindy Project",
  	  start: format.parse('25/09/2012'),
  	  end: format.parse('')
  	},
  	{
  	  name: "Archer",
  	  start: format.parse('14/01/2010'),
  	  end: format.parse('')
  	},
  	{
  	  name: "Community",
  	  start: format.parse('17/09/2009'),
  	  end: format.parse('')
  	},
  	{
  	  name: "Austin & All",
  	  start: format.parse('02/12/2011'),
  	  end: format.parse('')
  	},
  	{
  	  name: "Baby Daddy",
  	  start: format.parse('20/06/2012'),
  	  end: format.parse('')
  	},
  	{
  	  name: "New Girl",
  	  start: format.parse('20/09/2011'),
  	  end: format.parse('')
  	},
  	{
  	  name: "Arthur",
  	  start: format.parse('02/09/1996'),
  	  end: format.parse('')
  	},
  	{
  	  name: "Episodes",
  	  start: format.parse('09/01/2011'),
  	  end: format.parse('')
  	},
  	{
  	  name: "BoJack Horseman",
  	  start: format.parse('22/08/2014'),
  	  end: format.parse('')
  	},
  	{
  	  name: "Amos 'n' Andy",
  	  start: format.parse('19/03/1928'),
  	  end: format.parse('25/11/1960')
  	},
  	{
  	  name: "Futurama",
  	  start: format.parse('28/03/1999'),
  	  end: format.parse('10/08/2013')
  	},
  	{
  	  name: "Cheers",
  	  start: format.parse('30/09/1982'),
  	  end: format.parse('20/05/1993')
  	},
  	{
  	  name: "Frasier",
  	  start: format.parse('16/09/1993'),
  	  end: format.parse('13/05/2004')
  	},
  	{
  	  name: "Married... with Children",
  	  start: format.parse('05/04/1987'),
  	  end: format.parse('09/06/1997')
  	},
  	{
  	  name: "Friends",
  	  start: format.parse('22/09/1994'),
  	  end: format.parse('06/05/2004')
  	},
  	{
  	  name: "Seinfeld",
  	  start: format.parse('05/07/1989'),
  	  end: format.parse('14/05/1998')
  	},
  	{
  	  name: "How I Met Your Mother",
  	  start: format.parse('19/09/2005'),
  	  end: format.parse('31/03/2014')
  	},
  	{
  	  name: "Scrubs",
  	  start: format.parse('02/10/2001'),
  	  end: format.parse('17/03/2010')
  	},
  	{
  	  name: "The George Burns and Gracie Allen Show",
  	  start: format.parse('12/10/1950'),
  	  end: format.parse('15/09/1958')
  	},
  	{
  	  name: "Home Improvement",
  	  start: format.parse('17/09/1991'),
  	  end: format.parse('25/05/1999')
  	},
  	{
  	  name: "The Cosby Show",
  	  start: format.parse('20/09/1984'),
  	  end: format.parse('30/04/1992')
  	},
  	{
  	  name: "According to Jim",
  	  start: format.parse('03/10/2001'),
  	  end: format.parse('02/06/2009')
  	},
  	{
  	  name: "Bewitched",
  	  start: format.parse('17/09/1964'),
  	  end: format.parse('25/03/1972')
  	},
  	{
  	  name: "The Golden Girls",
  	  start: format.parse('14/09/1985'),
  	  end: format.parse('09/05/1992')
  	},
  	{
  	  name: "Boy Meets World",
  	  start: format.parse('24/09/1993'),
  	  end: format.parse('05/05/2000')
  	},
  	{
  	  name: "30 Rock",
  	  start: format.parse('11/10/2006'),
  	  end: format.parse('31/01/2013')
  	},
  	{
  	  name: "1st & Ten",
  	  start: format.parse('02/12/1984'),
  	  end: format.parse('23/01/1991')
  	},
  	{
  	  name: "A Different World",
  	  start: format.parse('24/09/1987'),
  	  end: format.parse('10/07/1993')
  	},
  	{
  	  name: "Cougar Town",
  	  start: format.parse('23/09/2009'),
  	  end: format.parse('31/03/2015')
  	},
  	{
  	  name: "3rd Rock from the Sun",
  	  start: format.parse('09/01/1996'),
  	  end: format.parse('22/05/2001')
  	},
  	{
  	  name: "iCarly",
  	  start: format.parse('08/09/2007'),
  	  end: format.parse('23/11/2012')
  	},
  	{
  	  name: "Becker",
  	  start: format.parse('02/11/1998'),
  	  end: format.parse('28/01/2004')
  	},
  	{
  	  name: "Dharma & Greg",
  	  start: format.parse('24/09/1997'),
  	  end: format.parse('30/04/2002')
  	},
  	{
  	  name: "Ellen",
  	  start: format.parse('29/03/1994'),
  	  end: format.parse('22/07/1998')
  	},
  	{
  	  name: "Til Death",
  	  start: format.parse('07/09/2006'),
  	  end: format.parse('20/06/2010')
  	},
  	{
  	  name: "Mork & Mindy",
  	  start: format.parse('14/09/1978'),
  	  end: format.parse('27/05/1982')
  	},
  	{
  	  name: "Small Wonder",
  	  start: format.parse('07/09/1985'),
  	  end: format.parse('20/05/1989')
  	},
  	{
  	  name: "The Cleveland Show",
  	  start: format.parse('27/09/2009'),
  	  end: format.parse('19/05/2013')
  	},
  	{
  	  name: "Big Time Rush",
  	  start: format.parse('28/11/2009'),
  	  end: format.parse('25/07/2013')
  	},
  	{
  	  name: "ALF",
  	  start: format.parse('22/09/1986'),
  	  end: format.parse('24/03/1990')
  	},
  	{
  	  name: "The Looney Tunes Show",
  	  start: format.parse('03/05/2011'),
  	  end: format.parse('31/08/2014')
  	},
  	{
  	  name: "Lizzie McGuire",
  	  start: format.parse('12/01/2001'),
  	  end: format.parse('14/02/2004')
  	},
  	{
  	  name: "Victorious",
  	  start: format.parse('27/03/2010'),
  	  end: format.parse('02/02/2013')
  	},
  	{
  	  name: "A.N.T. Farm",
  	  start: format.parse('06/05/2011'),
  	  end: format.parse('21/03/2014')
  	},
  	{
  	  name: "Clueless",
  	  start: format.parse('20/09/1996'),
  	  end: format.parse('25/05/1999')
  	},
  	{
  	  name: "Are We There Yet?",
  	  start: format.parse('02/06/2010'),
  	  end: format.parse('01/03/2013')
  	},
  	{
  	  name: "My Favorite Martian",
  	  start: format.parse('29/09/1963'),
  	  end: format.parse('01/05/1966')
  	},
  	{
  	  name: "100 Deeds for Eddie McDowd",
  	  start: format.parse('16/10/1999'),
  	  end: format.parse('21/04/2002')
  	},
  	{
  	  name: "8 Simple Rules",
  	  start: format.parse('17/09/2002'),
  	  end: format.parse('15/04/2005')
  	},
  	{
  	  name: "Anger Management",
  	  start: format.parse('28/06/2012'),
  	  end: format.parse('22/12/2014')
  	},
  	{
  	  name: "I'm in the Band",
  	  start: format.parse('27/11/2009'),
  	  end: format.parse('09/12/2011')
  	},
  	{
  	  name: "Blue Mountain State",
  	  start: format.parse('11/01/2010'),
  	  end: format.parse('30/11/2011')
  	},
  	{
  	  name: "Doctor Doctor",
  	  start: format.parse('12/06/1989'),
  	  end: format.parse('06/04/1991')
  	},
  	{
  	  name: "The Munsters",
  	  start: format.parse('24/09/1964'),
  	  end: format.parse('12/05/1966')
  	},
  	{
  	  name: "Dilbert",
  	  start: format.parse('25/01/1999'),
  	  end: format.parse('25/07/2000')
  	},
  	{
  	  name: "The Neighbors",
  	  start: format.parse('26/09/2012'),
  	  end: format.parse('11/04/2014')
  	},
  	{
  	  name: "Better Off Ted",
  	  start: format.parse('18/03/2009'),
  	  end: format.parse('24/08/2010')
  	},
  	{
  	  name: "Baby Bob",
  	  start: format.parse('18/03/2002'),
  	  end: format.parse('04/07/2003')
  	},
  	{
  	  name: "Bagdad Cafe",
  	  start: format.parse('30/03/1990'),
  	  end: format.parse('27/07/1991')
  	},
  	{
  	  name: "Harper Valley PTA",
  	  start: format.parse('16/01/1981'),
  	  end: format.parse('01/05/1982')
  	},
  	{
  	  name: "Don't Trust the B---- in Apartment 23",
  	  start: format.parse('11/04/2012'),
  	  end: format.parse('13/05/2013')
  	},
  	{
  	  name: "Sam & Cat",
  	  start: format.parse('08/06/2013'),
  	  end: format.parse('17/07/2014')
  	},
  	{
  	  name: "Almost Perfect",
  	  start: format.parse('17/09/1995'),
  	  end: format.parse('30/10/1996')
  	},
  	{
  	  name: "Off Centre",
  	  start: format.parse('14/10/2001'),
  	  end: format.parse('31/10/2002')
  	},
  	{
  	  name: "The Hard Times of RJ Berger",
  	  start: format.parse('06/06/2010'),
  	  end: format.parse('30/05/2011')
  	},
  	{
  	  name: "Breaking In",
  	  start: format.parse('06/04/2011'),
  	  end: format.parse('03/04/2012')
  	},
  	{
  	  name: "Bakersfield P.D.",
  	  start: format.parse('14/09/1993'),
  	  end: format.parse('18/08/1994')
  	},
  	{
  	  name: "10 Things I Hate About You",
  	  start: format.parse('07/07/2009'),
  	  end: format.parse('24/05/2010')
  	},
  	{
  	  name: "Andy Richter Controls the Universe",
  	  start: format.parse('19/03/2002'),
  	  end: format.parse('12/01/2003')
  	},
  	{
  	  name: "Ann Jillian",
  	  start: format.parse('30/11/1989'),
  	  end: format.parse('01/09/1990')
  	},
  	{
  	  name: "Angel",
  	  start: format.parse('06/10/1960'),
  	  end: format.parse('14/06/1961')
  	},
  	{
  	  name: "Bailey Kipper's P.O.V.",
  	  start: format.parse('14/09/1996'),
  	  end: format.parse('31/05/1997')
  	},
  	{
  	  name: "Aliens in America",
  	  start: format.parse('01/10/2007'),
  	  end: format.parse('18/05/2008')
  	},
  	{
  	  name: "Better with You",
  	  start: format.parse('22/09/2010'),
  	  end: format.parse('11/05/2011')
  	},
  	{
  	  name: "Trophy Wife",
  	  start: format.parse('24/09/2013'),
  	  end: format.parse('13/05/2014')
  	},
  	{
  	  name: "Brian O'Brian",
  	  start: format.parse('03/10/2008'),
  	  end: format.parse('03/04/2009')
  	},
  	{
  	  name: "All American Girl",
  	  start: format.parse('14/09/1994'),
  	  end: format.parse('15/03/1995')
  	},
  	{
  	  name: "Bonnie",
  	  start: format.parse('22/09/1995'),
  	  end: format.parse('07/04/1996')
  	},
  	{
  	  name: "Aliens in the Family",
  	  start: format.parse('15/03/1996'),
  	  end: format.parse('31/08/1996')
  	},
  	{
  	  name: "$h*! My Dad Says",
  	  start: format.parse('23/09/2010'),
  	  end: format.parse('17/02/2011')
  	},
  	{
  	  name: "A Family for Joe",
  	  start: format.parse('24/03/1990'),
  	  end: format.parse('19/08/1990')
  	},
  	{
  	  name: "A League of Their Own",
  	  start: format.parse('10/04/1993'),
  	  end: format.parse('13/08/1993')
  	},
  	{
  	  name: "Bette",
  	  start: format.parse('11/10/2000'),
  	  end: format.parse('07/03/2001')
  	},
  	{
  	  name: "Selfie (TV series)",
  	  start: format.parse('30/09/2014'),
  	  end: format.parse('30/12/2014')
  	},
  	{
  	  name: "1600 Penn",
  	  start: format.parse('17/12/2012'),
  	  end: format.parse('28/03/2013')
  	},
  	{
  	  name: "Ben and Kate",
  	  start: format.parse('25/09/2012'),
  	  end: format.parse('22/01/2013')
  	},
  	{
  	  name: "Here and Now",
  	  start: format.parse('19/09/1992'),
  	  end: format.parse('02/01/1993')
  	},
  	{
  	  name: "Hot l Baltimore",
  	  start: format.parse('24/01/1975'),
  	  end: format.parse('25/04/1975')
  	},
  	{
  	  name: "A to Z",
  	  start: format.parse('02/10/2014'),
  	  end: format.parse('22/01/2015')
  	},
  	{
  	  name: "Family Tools",
  	  start: format.parse('01/05/2013'),
  	  end: format.parse('10/07/2013')
  	},
  	{
  	  name: "Are You There, Chelsea?",
  	  start: format.parse('11/01/2012'),
  	  end: format.parse('28/03/2012')
  	},
  	{
  	  name: "Allen Gregory",
  	  start: format.parse('30/10/2011'),
  	  end: format.parse('18/12/2011')
  	},
  	{
  	  name: "100 Questions",
  	  start: format.parse('27/05/2010'),
  	  end: format.parse('01/07/2010')
  	},
  	{
  	  name: "Arsenio",
  	  start: format.parse('05/03/1997'),
  	  end: format.parse('23/04/1997')
  	},
  	{
  	  name: "Big Wave Dave's",
  	  start: format.parse('09/08/1993'),
  	  end: format.parse('13/09/1993')
  	},
  	{
  	  name: "Bent",
  	  start: format.parse('21/03/2012'),
  	  end: format.parse('04/04/2012')
  	},
  	{
  	  name: "704 Hauser",
  	  start: format.parse('11/04/1994'),
  	  end: format.parse('09/05/1994')
  	},
  	{
  	  name: "Flesh 'n' Blood",
  	  start: format.parse('19/09/1991'),
  	  end: format.parse('15/10/1991')
  	},
  	{
  	  name: "As If",
  	  start: format.parse('05/03/2002'),
  	  end: format.parse('12/03/2002')
  	},
  	{
  	  name: "Ask Harriet",
  	  start: format.parse('04/01/1998'),
  	  end: format.parse('29/01/1998')
  	},
  	{
  	  name: "Battery Park",
  	  start: format.parse('23/03/2000'),
  	  end: format.parse('13/04/2000')
  	},
  	{
  	  name: "Big Lake",
  	  start: format.parse('17/08/2010'),
  	  end: format.parse('14/09/2010')
  	},
  	{
  	  name: "Bringing up Jack",
  	  start: format.parse('27/05/1995'),
  	  end: format.parse('24/06/1995')
  	}
  ];

  var tl = new Timeline(items, {
  	widthOfYear: 40
  });
  tl.draw(d3.select('.timeline-container')[0][0]);
}]);
