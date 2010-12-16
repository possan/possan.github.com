
ImageScaler2 = {

    calcSize: function (iw, ih, inputaspect) {
        var r = { width: 0, height: 0 };
        if (iw > 0)
            r.width = iw;
        if (ih > 0)
            r.height = ih;
        if (r.height == 0)
            r.height = Math.round(r.width / inputaspect);
        if (r.width == 0)
            r.width = Math.round(r.height * inputaspect);
        return r;
    },

    calcMag: function (iw, ih, ow, oh, fill) {

        var ia = iw / ih;
        var oa = ow / oh;
        var wm = ow / iw;
        var hm = oh / ih;

        var mag = fill ? Math.max(wm, hm) : Math.min(wm, hm);
        if (!fill)
            if (mag > 1.0)
                mag = 1.0;

        mag *= 100;
        mag = Math.ceil(mag);
        mag /= 100;

        return mag;
    },

    calcRegion1: function (iw, ih, ow, oh, fill) {

        var mag = ImageScaler2.calcMag(iw, ih, ow, oh, fill);

        var r = { mag: mag };


        var how2 = iw * mag / 2;
        var hoh2 = ih * mag / 2;
        var cx = ow / 2;
        var cy = oh / 2;
        r.l = Math.floor(cx - how2);
        r.t = Math.floor(cy - hoh2);
        r.r = Math.ceil(cx + how2);
        r.b = Math.ceil(cy + hoh2);

        return r;
    },

    calcRegion2: function (iw, ih, ow, oh, cx, cy, fill) {

        var mag = ImageScaler2.calcMag(iw, ih, ow, oh, fill);

        var r = { mag: mag };

        var how2 = iw * mag / 2;
        var hoh2 = ih * mag / 2;

        var cx = ow / 2;
        var cy = oh / 2;

        r.l = Math.floor(cx - how2);
        r.t = Math.floor(cy - hoh2);
        r.r = Math.ceil(cx + how2);
        r.b = Math.ceil(cy + hoh2);

        return r;
    },

    calcRegion3: function (iw, ih, ow, oh, rx1, ry1, rx2, ry2, fill) {

        var mag = ImageScaler2.calcMag(iw, ih, ow, oh, fill);

        var rw = rx2 - rx1;
        var rh = ry2 - ry1;
        var rmag = ImageScaler2.calcMag(iw, ih, rw, rh, fill) * mag;

        // region on input
        var rxi = (rx1 + rx2) / 2;
        var ryi = (ry1 + ry2) / 2;

        // region on outupt
        var rxo = rxi * mag;
        var ryo = ryi * mag;

        // input span
        var rxsi = iw - rw;
        var rysi = ih - rh;

        // output span
        var rxso = rxsi * mag;
        var ryso = rysi * mag;

        // offset percent
        var rxp = (rxso > 0) ? rx1 / rxsi : 0;
        var ryp = (ryso > 0) ? ry1 / rysi : 0;

        // return structure
        var r = {
            mag: mag,
            rw: rw,
            rh: rh,
            rmag: rmag,
            rxo: rxo,
            ryo: ryo,
            rxi: rxi,
            ryi: ryi,
            rxso: rxso,
            ryso: ryso,
            rxsi: rxsi,
            rysi: rysi,
            ryp: ryp,
            rxp: rxp
        };

        // output size
        var how2 = iw * mag / 2;
        var hoh2 = ih * mag / 2;

        // output center
        var cx = (ow / 2) - (rxso * (rxp - 0.5));
        var cy = (oh / 2) - (ryso * (ryp - 0.5));

        // borders
        r.l = Math.floor(cx - how2);
        r.t = Math.floor(cy - hoh2);
        r.r = Math.ceil(cx + how2);
        r.b = Math.ceil(cy + hoh2);

        // profit
        return r;
    },

    getThumbnail: function (inputurl, iw, ih, ow, oh, rx1, ry1, rx2, ry2) {
    }

};

