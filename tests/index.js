function block(time) {
  return function() {
    var now = Date.now();
    while(Date.now() - now < time);
  };
}

describe('perfTrack', function() {
  it('installs correctly', function() {
    expect(window).to.have.property('perfTrack').which.is.a('function');
  });
  it('invoke callback on slow frame', function() {
    this.timeout(3500);
    var callback = sinon.spy();
    var stop = window.perfTrack({}, callback);
    return Promise.delay(1000)
    .then(block(500))
    .delay(16)
    .then(function() {
      expect(callback).to.have.been.calledOnce;
    })
    .finally(function() {
      stop();
    });
  });
  it('doesnt invoke callback when no frame is above threshold', function() {
    this.timeout(3500);
    var callback = sinon.spy();
    var stop = window.perfTrack({ frameDurationThreshold: 3000 }, callback);
    return Promise.delay(1000)
    .then(block(2000))
    .delay(16)
    .then(function() {
      expect(callback).to.not.have.been.called;
    })
    .finally(function() {
      stop();
    });
  });
  it('doesnt invoke callback when slowframe occurs before startAfter', function() {
    this.timeout(3500);
    var callback = sinon.spy();
    var stop = window.perfTrack({ startAfter: 1000 }, callback);
    return Promise.delay(200)
    .then(block(2000))
    .delay(16)
    .then(function() {
      expect(callback).to.not.have.been.called;
    })
    .finally(function() {
      stop();
    });
  });
  it('stops reporting slow frames after stop() is called', function() {
    this.timeout(3500);
    var callback = sinon.spy();
    var stop = window.perfTrack({ frameDurationThreshold: 200 }, callback);
    return Promise.delay(1000)
    .then(block(500))
    .delay(16)
    .then(function() {
      expect(callback).to.have.been.calledOnce;
    })
    .then(function() {
      stop();
    })
    .then(block(500))
    .delay(16)
    .then(function() {
      expect(callback).to.have.been.calledOnce;
    });
  });
  it('stops reporting slow frames after bailing out', function() {
    this.timeout(3500);
    var callback = sinon.spy();
    window.perfTrack({ frameDurationThreshold: 200, startAfter: 100, bailOut: true }, callback);
    return Promise.delay(150)
    .then(block(300))
    .delay(16)
    .then(function() {
      expect(callback).to.have.been.calledOnce;
    })
    .then(block(300))
    .delay(16)
    .then(function() {
      expect(callback).to.have.been.calledOnce;
    });
  })
});
