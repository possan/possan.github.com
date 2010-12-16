
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

        var rw = rx2 - rx1;
        var rh = ry2 - ry1;

        var oa = ow / oh;

        // fix region aspect 
        if (ow > oh) {
            rh = rw / oa;
        } else if (ow < oh) {
            rw = rh * oa;
        }

        // re center region
        var rx = (rx1 + rx2) / 2;
        var ry = (ry1 + ry2) / 2;
        rx1 = rx - rw / 2;
        ry1 = ry - rh / 2;
        rx2 = rx + rw / 2;
        ry2 = ry + rh / 2;

        var mag = ImageScaler2.calcMag(iw, ih, ow, oh, fill);

        var rmag = ImageScaler2.calcMag(rw, rh, ow, oh, fill);
        if (mag < rmag)
            mag = rmag;
             
        var how = ow * mag;
        var hoh = oh * mag;
        var how2 = how / 2;
        var hoh2 = hoh / 2;

        // output span (screenspace)

        // input span (texturespace)
        var rxsi = (iw * mag) - (ow);
        var rysi = (ih * mag) - (oh); // ryso / mag;

        var rxso = rxsi; // / mag;
        var ryso = rysi; // / mag;

        // offset (percent)
        var rxp = (rxsi > 0) ? rx1 * mag / rxsi : 0;
        var ryp = (rysi > 0) ? ry1 * mag / rysi : 0;

        // clip and round
        rxp = Math.max(0, Math.min(1, rxp));
        ryp = Math.max(0, Math.min(1, ryp));
        rxp = Math.round(rxp * 1000) / 1000;
        ryp = Math.round(ryp * 1000) / 1000;

        // return structure
        var r = {
            rw: rw,
            rh: rh,
            mag: mag,
            rmag: rmag,
            how: how,
            hoh: hoh,
            rw: rw,
            rh: rh,
            rxp: rxp,
            ryp: ryp,
            rxso: rxso,
            ryso: ryso,
            rxsi: rxsi,
            rysi: rysi
        };

        // offset in screenspace
        var cx = rxso * rxp;
        var cy = ryso * ryp;

        // limit region to image
        if (fill) {
            cx = Math.max(cx, 0);
            cy = Math.max(cy, 0);
            cx = Math.min(cx, rxso);
            cy = Math.min(cy, ryso);
        }

        // borders
        r.cx = cx;
        r.cy = cy;
        r.l = Math.floor(-cx);
        r.t = Math.floor(-cy);
        r.r = Math.ceil(-cx + how);
        r.b = Math.ceil(-cy + hoh);

        // profit
        return r;
    },

    getThumbnail: function (inputurl, iw, ih, ow, oh, rx1, ry1, rx2, ry2) {
    }

};

