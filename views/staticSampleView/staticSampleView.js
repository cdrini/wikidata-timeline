'use strict';

angular.module('wikidataTimeline.staticSampleView', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/samples', {
    templateUrl: 'views/staticSampleView/staticSampleView.html',
    controller: 'StaticSampleViewCtrl'
  });
}])

.controller('StaticSampleViewCtrl', [function() {
  var format = d3.time.format("%d/%m/%Y");
  var items = [
  	{
  	  name: "The Simpsons",
  	  href: "https://en.wikipedia.org/wiki/" + "The Simpsons",
  	  start: format.parse('17/12/1989'),
  	  end: format.parse('')
  	},
  	{
  	  name: "Two and a Half Men",
  	  href: "https://en.wikipedia.org/wiki/" + "Two and a Half Men",
  	  start: format.parse('22/09/2003'),
  	  end: format.parse('')
  	},
  	{
  	  name: "2 Broke Girls",
  	  href: "https://en.wikipedia.org/wiki/" + "2 Broke Girls",
  	  start: format.parse('19/09/2011'),
  	  end: format.parse('')
  	},
  	{
  	  name: "Last Man Standing",
  	  href: "https://en.wikipedia.org/wiki/" + "Last Man Standing",
  	  start: format.parse('11/10/2011'),
  	  end: format.parse('')
  	},
  	{
  	  name: "Save Me",
  	  href: "https://en.wikipedia.org/wiki/" + "Save Me",
  	  start: format.parse('23/05/2013'),
  	  end: format.parse('')
  	},
  	{
  	  name: "The Big Bang Theory",
  	  href: "https://en.wikipedia.org/wiki/" + "The Big Bang Theory",
  	  start: format.parse('24/09/2007'),
  	  end: format.parse('')
  	},
  	{
  	  name: "Arrested Development",
  	  href: "https://en.wikipedia.org/wiki/" + "Arrested Development",
  	  start: format.parse('02/11/2003'),
  	  end: format.parse('')
  	},
  	{
  	  name: "Modern Family",
  	  href: "https://en.wikipedia.org/wiki/" + "Modern Family",
  	  start: format.parse('23/09/2009'),
  	  end: format.parse('')
  	},
  	{
  	  name: "Curb Your Enthusiasm",
  	  href: "https://en.wikipedia.org/wiki/" + "Curb Your Enthusiasm",
  	  start: format.parse('15/10/2000'),
  	  end: format.parse('')
  	},
  	{
  	  name: "The Mindy Project",
  	  href: "https://en.wikipedia.org/wiki/" + "The Mindy Project",
  	  start: format.parse('25/09/2012'),
  	  end: format.parse('')
  	},
  	{
  	  name: "Archer",
  	  href: "https://en.wikipedia.org/wiki/" + "Archer",
  	  start: format.parse('14/01/2010'),
  	  end: format.parse('')
  	},
  	{
  	  name: "Community",
  	  href: "https://en.wikipedia.org/wiki/" + "Community",
  	  start: format.parse('17/09/2009'),
  	  end: format.parse('')
  	},
  	{
  	  name: "Austin & All",
  	  href: "https://en.wikipedia.org/wiki/" + "Austin & All",
  	  start: format.parse('02/12/2011'),
  	  end: format.parse('')
  	},
  	{
  	  name: "Baby Daddy",
  	  href: "https://en.wikipedia.org/wiki/" + "Baby Daddy",
  	  start: format.parse('20/06/2012'),
  	  end: format.parse('')
  	},
  	{
  	  name: "New Girl",
  	  href: "https://en.wikipedia.org/wiki/" + "New Girl",
  	  start: format.parse('20/09/2011'),
  	  end: format.parse('')
  	},
  	{
  	  name: "Arthur",
  	  href: "https://en.wikipedia.org/wiki/" + "Arthur",
  	  start: format.parse('02/09/1996'),
  	  end: format.parse('')
  	},
  	{
  	  name: "Episodes",
  	  href: "https://en.wikipedia.org/wiki/" + "Episodes",
  	  start: format.parse('09/01/2011'),
  	  end: format.parse('')
  	},
  	{
  	  name: "BoJack Horseman",
  	  href: "https://en.wikipedia.org/wiki/" + "BoJack Horseman",
  	  start: format.parse('22/08/2014'),
  	  end: format.parse('')
  	},
  	{
  	  name: "Amos 'n' Andy",
  	  href: "https://en.wikipedia.org/wiki/" + "Amos 'n' Andy",
  	  start: format.parse('19/03/1928'),
  	  end: format.parse('25/11/1960')
  	},
  	{
  	  name: "Futurama",
  	  href: "https://en.wikipedia.org/wiki/" + "Futurama",
  	  start: format.parse('28/03/1999'),
  	  end: format.parse('10/08/2013')
  	},
  	{
  	  name: "Cheers",
  	  href: "https://en.wikipedia.org/wiki/" + "Cheers",
  	  start: format.parse('30/09/1982'),
  	  end: format.parse('20/05/1993')
  	},
  	{
  	  name: "Frasier",
  	  href: "https://en.wikipedia.org/wiki/" + "Frasier",
  	  start: format.parse('16/09/1993'),
  	  end: format.parse('13/05/2004')
  	},
  	{
  	  name: "Married... with Children",
  	  href: "https://en.wikipedia.org/wiki/" + "Married... with Children",
  	  start: format.parse('05/04/1987'),
  	  end: format.parse('09/06/1997')
  	},
  	{
  	  name: "Friends",
  	  href: "https://en.wikipedia.org/wiki/" + "Friends",
  	  start: format.parse('22/09/1994'),
  	  end: format.parse('06/05/2004')
  	},
  	{
  	  name: "Seinfeld",
  	  href: "https://en.wikipedia.org/wiki/" + "Seinfeld",
  	  start: format.parse('05/07/1989'),
  	  end: format.parse('14/05/1998')
  	},
  	{
  	  name: "How I Met Your Mother",
  	  href: "https://en.wikipedia.org/wiki/" + "How I Met Your Mother",
  	  start: format.parse('19/09/2005'),
  	  end: format.parse('31/03/2014')
  	},
  	{
  	  name: "Scrubs",
  	  href: "https://en.wikipedia.org/wiki/" + "Scrubs",
  	  start: format.parse('02/10/2001'),
  	  end: format.parse('17/03/2010')
  	},
  	{
  	  name: "The George Burns and Gracie Allen Show",
  	  href: "https://en.wikipedia.org/wiki/" + "The George Burns and Gracie Allen Show",
  	  start: format.parse('12/10/1950'),
  	  end: format.parse('15/09/1958')
  	},
  	{
  	  name: "Home Improvement",
  	  href: "https://en.wikipedia.org/wiki/" + "Home Improvement",
  	  start: format.parse('17/09/1991'),
  	  end: format.parse('25/05/1999')
  	},
  	{
  	  name: "The Cosby Show",
  	  href: "https://en.wikipedia.org/wiki/" + "The Cosby Show",
  	  start: format.parse('20/09/1984'),
  	  end: format.parse('30/04/1992')
  	},
  	{
  	  name: "According to Jim",
  	  href: "https://en.wikipedia.org/wiki/" + "According to Jim",
  	  start: format.parse('03/10/2001'),
  	  end: format.parse('02/06/2009')
  	},
  	{
  	  name: "Bewitched",
  	  href: "https://en.wikipedia.org/wiki/" + "Bewitched",
  	  start: format.parse('17/09/1964'),
  	  end: format.parse('25/03/1972')
  	},
  	{
  	  name: "The Golden Girls",
  	  href: "https://en.wikipedia.org/wiki/" + "The Golden Girls",
  	  start: format.parse('14/09/1985'),
  	  end: format.parse('09/05/1992')
  	},
  	{
  	  name: "Boy Meets World",
  	  href: "https://en.wikipedia.org/wiki/" + "Boy Meets World",
  	  start: format.parse('24/09/1993'),
  	  end: format.parse('05/05/2000')
  	},
  	{
  	  name: "30 Rock",
  	  href: "https://en.wikipedia.org/wiki/" + "30 Rock",
  	  start: format.parse('11/10/2006'),
  	  end: format.parse('31/01/2013')
  	},
  	{
  	  name: "1st & Ten",
  	  href: "https://en.wikipedia.org/wiki/" + "1st & Ten",
  	  start: format.parse('02/12/1984'),
  	  end: format.parse('23/01/1991')
  	},
  	{
  	  name: "A Different World",
  	  href: "https://en.wikipedia.org/wiki/" + "A Different World",
  	  start: format.parse('24/09/1987'),
  	  end: format.parse('10/07/1993')
  	},
  	{
  	  name: "Cougar Town",
  	  href: "https://en.wikipedia.org/wiki/" + "Cougar Town",
  	  start: format.parse('23/09/2009'),
  	  end: format.parse('31/03/2015')
  	},
  	{
  	  name: "3rd Rock from the Sun",
  	  href: "https://en.wikipedia.org/wiki/" + "3rd Rock from the Sun",
  	  start: format.parse('09/01/1996'),
  	  end: format.parse('22/05/2001')
  	},
  	{
  	  name: "iCarly",
  	  href: "https://en.wikipedia.org/wiki/" + "iCarly",
  	  start: format.parse('08/09/2007'),
  	  end: format.parse('23/11/2012')
  	},
  	{
  	  name: "Becker",
  	  href: "https://en.wikipedia.org/wiki/" + "Becker",
  	  start: format.parse('02/11/1998'),
  	  end: format.parse('28/01/2004')
  	},
  	{
  	  name: "Dharma & Greg",
  	  href: "https://en.wikipedia.org/wiki/" + "Dharma & Greg",
  	  start: format.parse('24/09/1997'),
  	  end: format.parse('30/04/2002')
  	},
  	{
  	  name: "Ellen",
  	  href: "https://en.wikipedia.org/wiki/" + "Ellen",
  	  start: format.parse('29/03/1994'),
  	  end: format.parse('22/07/1998')
  	},
  	{
  	  name: "Til Death",
  	  href: "https://en.wikipedia.org/wiki/" + "Til Death",
  	  start: format.parse('07/09/2006'),
  	  end: format.parse('20/06/2010')
  	},
  	{
  	  name: "Mork & Mindy",
  	  href: "https://en.wikipedia.org/wiki/" + "Mork & Mindy",
  	  start: format.parse('14/09/1978'),
  	  end: format.parse('27/05/1982')
  	},
  	{
  	  name: "Small Wonder",
  	  href: "https://en.wikipedia.org/wiki/" + "Small Wonder",
  	  start: format.parse('07/09/1985'),
  	  end: format.parse('20/05/1989')
  	},
  	{
  	  name: "The Cleveland Show",
  	  href: "https://en.wikipedia.org/wiki/" + "The Cleveland Show",
  	  start: format.parse('27/09/2009'),
  	  end: format.parse('19/05/2013')
  	},
  	{
  	  name: "Big Time Rush",
  	  href: "https://en.wikipedia.org/wiki/" + "Big Time Rush",
  	  start: format.parse('28/11/2009'),
  	  end: format.parse('25/07/2013')
  	},
  	{
  	  name: "ALF",
  	  href: "https://en.wikipedia.org/wiki/" + "ALF",
  	  start: format.parse('22/09/1986'),
  	  end: format.parse('24/03/1990')
  	},
  	{
  	  name: "The Looney Tunes Show",
  	  href: "https://en.wikipedia.org/wiki/" + "The Looney Tunes Show",
  	  start: format.parse('03/05/2011'),
  	  end: format.parse('31/08/2014')
  	},
  	{
  	  name: "Lizzie McGuire",
  	  href: "https://en.wikipedia.org/wiki/" + "Lizzie McGuire",
  	  start: format.parse('12/01/2001'),
  	  end: format.parse('14/02/2004')
  	},
  	{
  	  name: "Victorious",
  	  href: "https://en.wikipedia.org/wiki/" + "Victorious",
  	  start: format.parse('27/03/2010'),
  	  end: format.parse('02/02/2013')
  	},
  	{
  	  name: "A.N.T. Farm",
  	  href: "https://en.wikipedia.org/wiki/" + "A.N.T. Farm",
  	  start: format.parse('06/05/2011'),
  	  end: format.parse('21/03/2014')
  	},
  	{
  	  name: "Clueless",
  	  href: "https://en.wikipedia.org/wiki/" + "Clueless",
  	  start: format.parse('20/09/1996'),
  	  end: format.parse('25/05/1999')
  	},
  	{
  	  name: "Are We There Yet?",
  	  href: "https://en.wikipedia.org/wiki/" + "Are We There Yet?",
  	  start: format.parse('02/06/2010'),
  	  end: format.parse('01/03/2013')
  	},
  	{
  	  name: "My Favorite Martian",
  	  href: "https://en.wikipedia.org/wiki/" + "My Favorite Martian",
  	  start: format.parse('29/09/1963'),
  	  end: format.parse('01/05/1966')
  	},
  	{
  	  name: "100 Deeds for Eddie McDowd",
  	  href: "https://en.wikipedia.org/wiki/" + "100 Deeds for Eddie McDowd",
  	  start: format.parse('16/10/1999'),
  	  end: format.parse('21/04/2002')
  	},
  	{
  	  name: "8 Simple Rules",
  	  href: "https://en.wikipedia.org/wiki/" + "8 Simple Rules",
  	  start: format.parse('17/09/2002'),
  	  end: format.parse('15/04/2005')
  	},
  	{
  	  name: "Anger Management",
  	  href: "https://en.wikipedia.org/wiki/" + "Anger Management",
  	  start: format.parse('28/06/2012'),
  	  end: format.parse('22/12/2014')
  	},
  	{
  	  name: "I'm in the Band",
  	  href: "https://en.wikipedia.org/wiki/" + "I'm in the Band",
  	  start: format.parse('27/11/2009'),
  	  end: format.parse('09/12/2011')
  	},
  	{
  	  name: "Blue Mountain State",
  	  href: "https://en.wikipedia.org/wiki/" + "Blue Mountain State",
  	  start: format.parse('11/01/2010'),
  	  end: format.parse('30/11/2011')
  	},
  	{
  	  name: "Doctor Doctor",
  	  href: "https://en.wikipedia.org/wiki/" + "Doctor Doctor",
  	  start: format.parse('12/06/1989'),
  	  end: format.parse('06/04/1991')
  	},
  	{
  	  name: "The Munsters",
  	  href: "https://en.wikipedia.org/wiki/" + "The Munsters",
  	  start: format.parse('24/09/1964'),
  	  end: format.parse('12/05/1966')
  	},
  	{
  	  name: "Dilbert",
  	  href: "https://en.wikipedia.org/wiki/" + "Dilbert",
  	  start: format.parse('25/01/1999'),
  	  end: format.parse('25/07/2000')
  	},
  	{
  	  name: "The Neighbors",
  	  href: "https://en.wikipedia.org/wiki/" + "The Neighbors",
  	  start: format.parse('26/09/2012'),
  	  end: format.parse('11/04/2014')
  	},
  	{
  	  name: "Better Off Ted",
  	  href: "https://en.wikipedia.org/wiki/" + "Better Off Ted",
  	  start: format.parse('18/03/2009'),
  	  end: format.parse('24/08/2010')
  	},
  	{
  	  name: "Baby Bob",
  	  href: "https://en.wikipedia.org/wiki/" + "Baby Bob",
  	  start: format.parse('18/03/2002'),
  	  end: format.parse('04/07/2003')
  	},
  	{
  	  name: "Bagdad Cafe",
  	  href: "https://en.wikipedia.org/wiki/" + "Bagdad Cafe",
  	  start: format.parse('30/03/1990'),
  	  end: format.parse('27/07/1991')
  	},
  	{
  	  name: "Harper Valley PTA",
  	  href: "https://en.wikipedia.org/wiki/" + "Harper Valley PTA",
  	  start: format.parse('16/01/1981'),
  	  end: format.parse('01/05/1982')
  	},
  	{
  	  name: "Don't Trust the B---- in Apartment 23",
  	  href: "https://en.wikipedia.org/wiki/" + "Don't Trust the B---- in Apartment 23",
  	  start: format.parse('11/04/2012'),
  	  end: format.parse('13/05/2013')
  	},
  	{
  	  name: "Sam & Cat",
  	  href: "https://en.wikipedia.org/wiki/" + "Sam & Cat",
  	  start: format.parse('08/06/2013'),
  	  end: format.parse('17/07/2014')
  	},
  	{
  	  name: "Almost Perfect",
  	  href: "https://en.wikipedia.org/wiki/" + "Almost Perfect",
  	  start: format.parse('17/09/1995'),
  	  end: format.parse('30/10/1996')
  	},
  	{
  	  name: "Off Centre",
  	  href: "https://en.wikipedia.org/wiki/" + "Off Centre",
  	  start: format.parse('14/10/2001'),
  	  end: format.parse('31/10/2002')
  	},
  	{
  	  name: "The Hard Times of RJ Berger",
  	  href: "https://en.wikipedia.org/wiki/" + "The Hard Times of RJ Berger",
  	  start: format.parse('06/06/2010'),
  	  end: format.parse('30/05/2011')
  	},
  	{
  	  name: "Breaking In",
  	  href: "https://en.wikipedia.org/wiki/" + "Breaking In",
  	  start: format.parse('06/04/2011'),
  	  end: format.parse('03/04/2012')
  	},
  	{
  	  name: "Bakersfield P.D.",
  	  href: "https://en.wikipedia.org/wiki/" + "Bakersfield P.D.",
  	  start: format.parse('14/09/1993'),
  	  end: format.parse('18/08/1994')
  	},
  	{
  	  name: "10 Things I Hate About You",
  	  href: "https://en.wikipedia.org/wiki/" + "10 Things I Hate About You",
  	  start: format.parse('07/07/2009'),
  	  end: format.parse('24/05/2010')
  	},
  	{
  	  name: "Andy Richter Controls the Universe",
  	  href: "https://en.wikipedia.org/wiki/" + "Andy Richter Controls the Universe",
  	  start: format.parse('19/03/2002'),
  	  end: format.parse('12/01/2003')
  	},
  	{
  	  name: "Ann Jillian",
  	  href: "https://en.wikipedia.org/wiki/" + "Ann Jillian",
  	  start: format.parse('30/11/1989'),
  	  end: format.parse('01/09/1990')
  	},
  	{
  	  name: "Angel",
  	  href: "https://en.wikipedia.org/wiki/" + "Angel",
  	  start: format.parse('06/10/1960'),
  	  end: format.parse('14/06/1961')
  	},
  	{
  	  name: "Bailey Kipper's P.O.V.",
  	  href: "https://en.wikipedia.org/wiki/" + "Bailey Kipper's P.O.V.",
  	  start: format.parse('14/09/1996'),
  	  end: format.parse('31/05/1997')
  	},
  	{
  	  name: "Aliens in America",
  	  href: "https://en.wikipedia.org/wiki/" + "Aliens in America",
  	  start: format.parse('01/10/2007'),
  	  end: format.parse('18/05/2008')
  	},
  	{
  	  name: "Better with You",
  	  href: "https://en.wikipedia.org/wiki/" + "Better with You",
  	  start: format.parse('22/09/2010'),
  	  end: format.parse('11/05/2011')
  	},
  	{
  	  name: "Trophy Wife",
  	  href: "https://en.wikipedia.org/wiki/" + "Trophy Wife",
  	  start: format.parse('24/09/2013'),
  	  end: format.parse('13/05/2014')
  	},
  	{
  	  name: "Brian O'Brian",
  	  href: "https://en.wikipedia.org/wiki/" + "Brian O'Brian",
  	  start: format.parse('03/10/2008'),
  	  end: format.parse('03/04/2009')
  	},
  	{
  	  name: "All American Girl",
  	  href: "https://en.wikipedia.org/wiki/" + "All American Girl",
  	  start: format.parse('14/09/1994'),
  	  end: format.parse('15/03/1995')
  	},
  	{
  	  name: "Bonnie",
  	  href: "https://en.wikipedia.org/wiki/" + "Bonnie",
  	  start: format.parse('22/09/1995'),
  	  end: format.parse('07/04/1996')
  	},
  	{
  	  name: "Aliens in the Family",
  	  href: "https://en.wikipedia.org/wiki/" + "Aliens in the Family",
  	  start: format.parse('15/03/1996'),
  	  end: format.parse('31/08/1996')
  	},
  	{
  	  name: "$h*! My Dad Says",
  	  href: "https://en.wikipedia.org/wiki/" + "$h*! My Dad Says",
  	  start: format.parse('23/09/2010'),
  	  end: format.parse('17/02/2011')
  	},
  	{
  	  name: "A Family for Joe",
  	  href: "https://en.wikipedia.org/wiki/" + "A Family for Joe",
  	  start: format.parse('24/03/1990'),
  	  end: format.parse('19/08/1990')
  	},
  	{
  	  name: "A League of Their Own",
  	  href: "https://en.wikipedia.org/wiki/" + "A League of Their Own",
  	  start: format.parse('10/04/1993'),
  	  end: format.parse('13/08/1993')
  	},
  	{
  	  name: "Bette",
  	  href: "https://en.wikipedia.org/wiki/" + "Bette",
  	  start: format.parse('11/10/2000'),
  	  end: format.parse('07/03/2001')
  	},
  	{
  	  name: "Selfie",
  	  href: "https://en.wikipedia.org/wiki/" + "Selfie",
  	  start: format.parse('30/09/2014'),
  	  end: format.parse('30/12/2014')
  	},
  	{
  	  name: "1600 Penn",
  	  href: "https://en.wikipedia.org/wiki/" + "1600 Penn",
  	  start: format.parse('17/12/2012'),
  	  end: format.parse('28/03/2013')
  	},
  	{
  	  name: "Ben and Kate",
  	  href: "https://en.wikipedia.org/wiki/" + "Ben and Kate",
  	  start: format.parse('25/09/2012'),
  	  end: format.parse('22/01/2013')
  	},
  	{
  	  name: "Here and Now",
  	  href: "https://en.wikipedia.org/wiki/" + "Here and Now",
  	  start: format.parse('19/09/1992'),
  	  end: format.parse('02/01/1993')
  	},
  	{
  	  name: "Hot l Baltimore",
  	  href: "https://en.wikipedia.org/wiki/" + "Hot l Baltimore",
  	  start: format.parse('24/01/1975'),
  	  end: format.parse('25/04/1975')
  	},
  	{
  	  name: "A to Z",
  	  href: "https://en.wikipedia.org/wiki/" + "A to Z",
  	  start: format.parse('02/10/2014'),
  	  end: format.parse('22/01/2015')
  	},
  	{
  	  name: "Family Tools",
  	  href: "https://en.wikipedia.org/wiki/" + "Family Tools",
  	  start: format.parse('01/05/2013'),
  	  end: format.parse('10/07/2013')
  	},
  	{
  	  name: "Are You There, Chelsea?",
  	  href: "https://en.wikipedia.org/wiki/" + "Are You There, Chelsea?",
  	  start: format.parse('11/01/2012'),
  	  end: format.parse('28/03/2012')
  	},
  	{
  	  name: "Allen Gregory",
  	  href: "https://en.wikipedia.org/wiki/" + "Allen Gregory",
  	  start: format.parse('30/10/2011'),
  	  end: format.parse('18/12/2011')
  	},
  	{
  	  name: "100 Questions",
  	  href: "https://en.wikipedia.org/wiki/" + "100 Questions",
  	  start: format.parse('27/05/2010'),
  	  end: format.parse('01/07/2010')
  	},
  	{
  	  name: "Arsenio",
  	  href: "https://en.wikipedia.org/wiki/" + "Arsenio",
  	  start: format.parse('05/03/1997'),
  	  end: format.parse('23/04/1997')
  	},
  	{
  	  name: "Big Wave Dave's",
  	  href: "https://en.wikipedia.org/wiki/" + "Big Wave Dave's",
  	  start: format.parse('09/08/1993'),
  	  end: format.parse('13/09/1993')
  	},
  	{
  	  name: "Bent",
  	  href: "https://en.wikipedia.org/wiki/" + "Bent",
  	  start: format.parse('21/03/2012'),
  	  end: format.parse('04/04/2012')
  	},
  	{
  	  name: "704 Hauser",
  	  href: "https://en.wikipedia.org/wiki/" + "704 Hauser",
  	  start: format.parse('11/04/1994'),
  	  end: format.parse('09/05/1994')
  	},
  	{
  	  name: "Flesh 'n' Blood",
  	  href: "https://en.wikipedia.org/wiki/" + "Flesh 'n' Blood",
  	  start: format.parse('19/09/1991'),
  	  end: format.parse('15/10/1991')
  	},
  	{
  	  name: "As If",
  	  href: "https://en.wikipedia.org/wiki/" + "As If",
  	  start: format.parse('05/03/2002'),
  	  end: format.parse('12/03/2002')
  	},
  	{
  	  name: "Ask Harriet",
  	  href: "https://en.wikipedia.org/wiki/" + "Ask Harriet",
  	  start: format.parse('04/01/1998'),
  	  end: format.parse('29/01/1998')
  	},
  	{
  	  name: "Battery Park",
  	  href: "https://en.wikipedia.org/wiki/" + "Battery Park",
  	  start: format.parse('23/03/2000'),
  	  end: format.parse('13/04/2000')
  	},
  	{
  	  name: "Big Lake",
  	  href: "https://en.wikipedia.org/wiki/" + "Big Lake",
  	  start: format.parse('17/08/2010'),
  	  end: format.parse('14/09/2010')
  	},
  	{
  	  name: "Bringing up Jack",
  	  href: "https://en.wikipedia.org/wiki/" + "Bringing up Jack",
  	  start: format.parse('27/05/1995'),
  	  end: format.parse('24/06/1995')
  	}
  ];

  var tl = new Timeline(items, {
  	widthOfYear: 40
  });
  tl.draw(d3.select('.timeline-container')[0][0]);
}]);
