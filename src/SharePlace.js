import { Modal } from './UI/Modal';
import { Map } from './UI/Map';
import { getCoordsFromAddress } from './Utility/Location';
import { getAddressFomCoords } from './Utility/Location';
import { encodeURI } from 'punycode';

class PlaceFinder {
    constructor() {
        const addressForm = document.querySelector('form');
        const locateUserBtn = document.getElementById('locate-btn');
        this.shareBtn = document.getElementById('share-btn');  // Assign to class property

        locateUserBtn.addEventListener('click', this.locateUserHandler.bind(this));
        this.shareBtn.addEventListener('click', this.sharePlaceHandler.bind(this)); // Bind 'this'
        addressForm.addEventListener('submit', this.findAddressHandler.bind(this));
    }

    sharePlaceHandler() {
        const shareLinkElement = document.getElementById('share-link');
        
        if (!navigator.clipboard) {
            shareLinkElement.select();    
            return;
        }

        navigator.clipboard.writeText(shareLinkElement.value)
            .then(() => {
                alert('Copied into clipboard!');
            })
            .catch(err => {
                console.log(err);
                shareLinkElement.select();
            });
    }

    selectPlace(coordinates, address) {
        if (this.map) {
            this.map.render(coordinates);
        } else {
            this.map = new Map(coordinates);
        }

        this.shareBtn.disabled = false;  // Now correctly references the class property
        const shareLinkElement = document.getElementById('share-link');
        shareLinkElement.value = `${location.origin}/my-place?address=${encodeURI(address)}&lat=${coordinates.lat}&lng=${coordinates.lng}`;
    }

    locateUserHandler() {
        if (!navigator.geolocation) {
            alert("Location Feature is not available in your browser. Please use a more modern browser!");
            return;
        }

        const modal = new Modal('loading-modal-content', 'Loading location - please wait');
        modal.show();

        navigator.geolocation.getCurrentPosition(
            async successResult => {
                modal.hide();
                const coordinates = {
                    lat: successResult.coords.latitude,
                    lng: successResult.coords.longitude
                };
                console.log(coordinates);
                const address = await getAddressFomCoords(coordinates);  // Added 'await'
                this.selectPlace(coordinates, address);
            },
            error => {
                modal.hide();
                alert('Could not locate you unfortunately. Please enter an address manually');
            }
        );
    }

    async findAddressHandler(event) {
        event.preventDefault();
        const address = event.target.querySelector('input').value;
        if (!address || address.trim().length === 0) {
            alert("Invalid address entered - please try again");
            return;
        }
        const modal = new Modal(
            'loading-modal-content',
            'Loading location - please wait'
        );
        modal.show();

        try {
            const coordinates = await getCoordsFromAddress(address);
            this.selectPlace(coordinates, address);
        } catch (err) {
            alert(err.message);
        }
        modal.hide();
    }
}

new PlaceFinder();
