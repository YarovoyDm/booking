import React from 'react';
import * as _ from 'lodash';
import Select from 'react-select';

import './testPage.css';
import { API } from '../../utils';

const requestsData = [
    { requestURL: '/terms', label: 'terms' },
    { requestURL: '/styles', label: 'styles' },
    { requestURL: '/brands_terms', label: 'brandsTerms' },
]

let data = null

class TestPage extends React.Component {
    state = {
        terms: [],
        styles: [],
        brandsTerms: [],
        termsSelected: null,
        stylesSelected: null,
        brandsTermsSelected: null,
        termsURL: '',
        stylesURL: '',
        brandsTermsURL: ''
    }

    componentDidMount() {
        _.map(requestsData, item => {
            API(item.requestURL).then((response) => {
                this.setState({
                    [item.label]: response.data,
                })
            })
        })
        _.map(this.props.match.params, (param, key) => {
            return this.setState({
                [key + 'Selected']: _.split(param, _.split(this.pref([key + 'Selected']), '/')[1])[1],
                [key + "URL"]: '/' + param
            })
        })
    }

    pref = (currentDropdown) => {
        if (currentDropdown[0] === 'termsSelected') {
            return '/s-'
        }
        if (currentDropdown[0] === 'brandsTermsSelected') {
            return '/b-'
        }
        if (currentDropdown[0] === 'stylesSelected') {
            return '/st-'
        }
    }

    onChange = (currentDropdown) => (e) => {
        const splitName = _.split(currentDropdown, 'Selected', 1)
        this.setState({
            [currentDropdown]: e.value,
            [splitName + "URL"]: this.pref(currentDropdown) + e.value
        }, () => {
            const url = this.state.termsURL + this.state.stylesURL + this.state.brandsTermsURL
            this.props.history.push('')
            this.props.history.push(url)
        })
    }

    renderDropdown() {
        const {brandsTerms, styles, terms} = this.state
        if (!brandsTerms || !terms || !styles) { return null }
        return _.map(requestsData, (item, key) => {
            const selected  = this.state[item.label + 'Selected']
            const checkCurrentValue = _.filter(this.state[item.label].data, selectItem => {
                return selectItem.slug === selected
            })
            const options = _.map(this.state[item.label].data, item => {
                return { value: item.slug, label: item.label }
            })
            if (!checkCurrentValue[0] && selected) { return <div key={key}>Loading...</div> }
            const label = selected ? checkCurrentValue[0].label : ''
            const value = selected ? checkCurrentValue[0].slug : ''
            return <Select
                key={key}
                defaultValue={{ label, value }}
                onChange={this.onChange([item.label + 'Selected'])}
                options={options}
            />
        })
    }

    render() {
        return (
            <div>
                {this.renderDropdown()}
            </div>
        )
    }
}

export default TestPage;
