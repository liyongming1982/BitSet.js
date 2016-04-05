
var assert = require('assert');
var should = require('should');

var BitSet = require('../bitset');

describe('BitSet', function() {

  it('should Construct', function() {

    var bs = new BitSet(19219);
    assert.equal(bs.toString(10), '19219');

    var bs = new BitSet;
    assert.equal(bs.toString(32), '0');

    var bs = new BitSet(-1);
    assert.equal(bs.toString(2), '11111111111111111111111111111111');
  });

  it('should set an individual bit', function() {
    var bs = new BitSet();
    bs.set(31);
    assert.equal(bs.get(31), 1);
  });

  it('should find first set', function() {
    var bs = new BitSet();
    bs.set(31);
    assert.equal(bs.msb(), 31);
  });

  it('should not be able to find first set in an empty bitset', function() {
    var bs = new BitSet();
    assert.equal(bs.msb(), Infinity);
  });

  it('should unset a bit', function() {
    var bs = new BitSet();
    bs.set(31);
    bs.clear(31);
    assert.equal(bs.get(31), 0);
  });

  it('should Hex in - Hex out', function() {

    var bs = new BitSet("0xD00000005");
    assert.equal(bs.toString(16), 'd00000005');

    var bs = new BitSet("0xff900018283821283");
    assert.equal(bs.toString(16), 'ff900018283821283');

    var bs = new BitSet("0x28123719b3bacf929cd9291929293818382939292");
    assert.equal(bs.toString(16), '28123719b3bacf929cd9291929293818382939292');

    var bs = new BitSet("0xd1b1bd81dbabd8ab8adbabcb8cb8c1b8c18bcb81b81b81b8caaaaaaaaafffffabababababa28328832838282838282828382834868682828");
    assert.equal(bs.toString(16), 'd1b1bd81dbabd8ab8adbabcb8cb8c1b8c18bcb81b81b81b8caaaaaaaaafffffabababababa28328832838282838282828382834868682828');
  });

  it('should Get range', function() {

    var bs = new BitSet("0xff900018283821283");
    assert.equal(bs.slice(16, 32).toString(16), '8382');

    var bs = new BitSet("0xff900018283821283");
    assert.equal(bs.slice(16, 40).toString(2), '1100000101000001110000010');

    var bs = new BitSet("0xff900018283821283");
    assert.equal(bs.slice(130, 160).toString(8), '0');
  });

  it('should And', function() {

    var bs = new BitSet("0xff05");
    assert.equal(bs.and("0xfe00").toString(16), 'fe00');

  });

  it('should Or', function() {

    var bs = new BitSet(256);
    assert.equal(bs.or(512).toString(16), '300');
  });

  it('should Xor', function() {

    var bs = new BitSet("1010");
    assert.equal(bs.xor("0011").toString(2), '1001');
  });

  it('should Equals', function() {

    var bs = new BitSet('100000000000111010101');
    assert.equal(bs.equals("100000000000111010101"), true);

    var bs = new BitSet('111010101');
    assert.equal(bs.equals("101010101"), false);
  });

  it('should Cardinality', function() {

    var bs = new BitSet('1000000000000000000001101');
    assert.equal(bs.cardinality(), 4);
  });

  it('should msbit', function() {

    var bs = new BitSet('1000000000000000000001101');
    assert.equal(bs.msb(), '1000000000000000000001101'.length - 1);
  });

  it('should msbit set', function() {

    var bs = new BitSet;

    bs = bs
            .set(100)
            .set(333);

    assert.equal(bs.msb(), 333);
  });

  it('should slice negated', function() {

    var bs = new BitSet(4);

    bs.not();

    assert.equal(bs.toString(), '...1111011');

    assert.equal(bs.slice(1).toString(), '...111101');

    assert.equal(bs.slice(1, 3).toString(), '101');
  });

  it('should msbit should work negative numbers', function() {
    var flipped = new BitSet().not();

    assert.equal(flipped.msb(), Infinity);
  });

  it('should ntzit', function() {

    assert.equal(new BitSet('10000000000110001000000000').ntz(), 9);

    assert.equal(new BitSet('00000000000000000000000000').ntz(), Infinity);

    assert.equal(new BitSet('10000000000000000000000000').ntz(), 25);

    assert.equal(new BitSet('10000000100000000000000000000000000000000000').ntz(), 35);
  });

  it('should set', function() {

    var bs = new BitSet;

    bs
            .set(4, 1) // Set bit on 4th pos
            .set(0) // Set bit on 0th pos
            .set(22, 1)
            .set(33, 1); // Set

    assert.equal(bs.toString(), '1000000000010000000000000000010001');

    bs = bs.set(33, 0); // And reset
    assert.equal(bs.toString(), '10000000000000000010001');

    assert.equal(bs.msb(), 22);

    bs = bs.set(330, 1);

    assert.equal(bs.msb(), 330); // Thus, msb is on 330
  });

  it('should string and', function() {

    var bsa = new BitSet();
    bsa.set(0);

    var bsb = new BitSet();
    bsb.set(32);

    bsa.and(bsb);

    bsa.cardinality().should.equal(0);
    bsb.cardinality().should.equal(1);

    bsa.get(0).should.equal(0);
    bsb.get(0).should.equal(0);

    bsa.get(32).should.equal(0);
    bsb.get(32).should.equal(1);

    for (var i = 0; i < 64; i++) {

      bsa.get(i).should.equal(0);
      bsb.get(i).should.equal(i === 32 ? 1 : 0);
    }

    bsa.toString().should.equal('0');
    bsb.toString().should.equal('100000000000000000000000000000000');
  });

  it('should string or', function() {

    var bsa = new BitSet();
    var bsb = new BitSet();

    bsa.set(0);
    bsb.set(32);

    bsa.or(bsb);

    bsa.cardinality().should.equal(2);
    bsb.cardinality().should.equal(1);

    bsa.get(0).should.equal(1);
    bsb.get(0).should.equal(0);

    bsa.get(32).should.equal(1);
    bsb.get(32).should.equal(1);

    for (var i = 0; i < 64; i++) {

      bsa.get(i).should.equal(i === 0 || i === 32 ? 1 : 0);
      bsb.get(i).should.equal(i === 32 ? 1 : 0);
    }

    bsa.toString().should.eql('100000000000000000000000000000001');
    bsb.toString().should.eql('100000000000000000000000000000000');
  });

  it('should pass setting in time', function(done) {

    var bs = new BitSet;
    var start = Date.now();
    for (var i = 0; i < 1000000; i++) {
      bs.set(i);
    }
    (Date.now() - start).should.be.below(50);
    done();

  });

  it('should string set', function() {

    var bs = new BitSet('1000000000010000000000000000010001');

    assert.equal(bs.toString(), '1000000000010000000000000000010001');
  });

  it('should set auto scale', function() {

    var bs = new BitSet;

    bs = bs.set(512);

    assert.equal(bs.get(511), 0);
    assert.equal(bs.get(512), 1);
    assert.equal(bs.get(513), 0);
  });

  it('should get', function() {

    var bs = new BitSet();

    bs = bs.set(4, 1); // Set bit on 4th pos
    bs = bs.set(0); // Set bit on 0th pos

    assert.equal(bs.get(4) + bs.get(0), 2);
  });

  it('should work with different length scales: and', function() {

    var a = new BitSet();
    var b = new BitSet();
    a = a.set(1);
    b = b.set(50);

    assert.equal(a.clone().and(b).toString(), b.clone().and(a).toString());
  });

  it('should work with different length scales: or', function() {

    var a = new BitSet();
    var b = new BitSet();
    a = a.set(1);
    b = b.set(50);

    assert.equal(a.clone().or(b).toString(), b.clone().or(a).toString());
  });

  it('should work with different length scales: xor', function() {

    var a = new BitSet();
    var b = new BitSet();
    a = a.set(1);
    b = b.set(50);

    assert.equal(a.clone().xor(b).toString(), b.clone().xor(a).toString());
  });

  it('should work with zero: xor', function() {

    var a = new BitSet();
    var b = new BitSet();
    a = a.set(1);
    a = b.set(50);

    assert.equal(a.xor(b).toString(), b.xor(a).toString());
  });

  it('should work with inverted zero', function() {

    var a = new BitSet();
    a = a.not();

    assert.equal(a.toString(), '...1111');
  });

  it('should cut off infinity', function() {

    var a = new BitSet();
    a = a.not();
    assert.equal(a.toString(), '...1111');

    a = a.and(0xff);

    assert.equal(a.toString(), '11111111');
  });

  it('should work with simple xor use case', function() {
    var bsa = new BitSet
    bsa.set(0);
    bsa.set(1);

    var bsb = new BitSet;
    bsb.set(32);
    bsb = bsb.set(1);
    bsa = bsa.xor(bsb);

    bsa.cardinality().should.eql(2);
    bsa.get(0).should.eql(1);
    bsa.get(32).should.eql(1);

    bsa.toArray().toString().should.eql("0,32");
  });

  it('should get large undefined offsets', function() {

    var a = new BitSet();
    a = a.not();

    assert.equal(a.get(2000), 1);

  });

  it('should work with empty checks', function() {

    var a = new BitSet();

    assert.equal(a.isEmpty(), true);

    a.set(1000);
    assert.equal(a.isEmpty(), false);
  });

  it('should work with inverting', function() {

    var x = new BitSet;
    x.set(4);
    x.set(32);
    x.not();
    x.set(65, 0);
    x.not();
    x.set(8, 1);

    assert.equal(x.cardinality(), 4);
    assert.deepEqual(x.data, [272, 1, 2, 0, 0, 0, 0, 0, 0, 0]);
    assert.deepEqual(x.toArray(), [4, 8, 32, 65]);
  });

  it('should withstand some fuzz', function() {

    for (var i = 0; i < 100; i++) {

      var foo = BitSet();
      var x = 0;

      var tmp = Math.random() * (1 << 24) | 0;
      foo = foo.or(tmp);
      x |= tmp;

      var tmp = Math.random() * (1 << 24) | 0;
      foo = foo.xor(tmp);
      x ^= tmp;

      var tmp = Math.random() * (1 << 24) | 0;
      foo = foo.and(tmp);
      x &= tmp;

      // x = ~x;
      //foo = foo.not();     
      assert.equal(x.toString(2), foo.toString(2));
    }
  });

  it('should work with infinity strings', function() {

    var x = BitSet('11').not().set(35, 0);

    assert.equal(x.toString(2), '...1111011111111111111111111111111111111100');
  });

  it('should work with reported bug', function() {
    var bs1 = new BitSet("101");
    var ss = bs1.toString(); // expecting "101", actual "101" Note: bs1 = {length=1, [0]=5}
    var a = bs1.get(1);      // expecting 0, actual 0
    var b = bs1.get(2);      // expecting 1, actual 1

    var bs2 = new BitSet("111");
    ss = bs2.toString();    // expecting "111", actual "111" Note: bs2 = {length=1, [0]=7}
    assert.equal(ss, '111');

    var bs3 = bs2.clear(1);
    ss = bs3.toString();     // expecting "101", actual "1" Note: bs3 = {length=2, [0]=1,[1]=0}
    assert.equal(ss, '101');

    var c = bs3.get(1);      // expecting 0, actual 0
    assert.equal(c, 0);
    var d = bs3.get(2);      // expecting 1, actual 0
    assert.equal(d, 1);
    var t = bs3.equals(bs1); // expecting true, actual false
    assert.equal(t, true);
  });

  it('should clear', function() {
    var bs1 = new BitSet("111101");
    bs1.clear(5);
    assert.equal(bs1.toString(), '11101');
    bs1.clear();
    assert.equal(bs1.toString(), '0');
  });
});
