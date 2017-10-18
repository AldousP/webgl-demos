function AssetHandler (map, onComplete) {
	this.loadedFileCount = 0;
	this.map = map;
	this.assets = {};
  /**
   * Called when every file has finished loading.
   */
  this.onCompleted = onComplete;

  /**
	 * Begins loading the assets.
	 */
	this.load = function () {
		var keys = Object.keys(this.map);
		if (keys) {
			var that = this;
			keys.forEach(function (key) {
				var ref = that.map[key];
				that._loadFile(ref, key);
			})
		}
	};

	/**
	 * Called after each asset is loaded. Increments the loaded asset count.
	 */
	this._assetLoaded = function () {
		this.loadedFileCount ++;
		if (Object.keys(this.map).length === this.loadedFileCount) {
			this.onCompleted(this.assets);
		}
	};

	/**
	 * Loads a file with the given handle from the domain.
	 */
	this._loadFile = function (srcRef, name, callback) {
		var req = new XMLHttpRequest();
		var that = this;
		req.onreadystatechange = function () {
			if (this.readyState === 4 && this.status === 200) {
				that.assets[name] = req.responseText;
				that._assetLoaded();
				if (typeof callback === 'function') {
					callback();
				}
			}
		};
		req.open("GET", srcRef, true);
		req.send();
	};
}