import numpy as np


def max_drawdown(data):
    """The worst return over the period"""
    max_d = 1
    for i in range(len(data)):
        for e in range(i, len(data)):
            ratio = data[e] / data[i]
            max_d = min(max_d, ratio)
    return max_d


def max_loss_period(data):
    """The max loss period"""
    max_days = 0
    for i in range(len(data)):
        for e in range(i+1, len(data)):
            if data[e] / data[i] >= 1:
                break
            max_days = max(max_days, e-i)
    return max_days


def one_year_positive(data):
    """Probability of loss after one year"""
    rs = get_return(data, 252)
    return np.mean(rs > 1)


def one_year_var(data, value = 0.95):
    """Worst return after one year with x% confidency"""
    rs = get_return(data, 252)
    ids = np.argsort(rs)
    return rs[ids[-int(len(rs) * value)]]


def one_year_expected_shortfall(data, value = 0.95):
    """Avergae loss in the worst x% scenarios"""
    rs = get_return(data, 252)
    ids = np.argsort(rs)
    return np.mean(rs[ids[:-int(len(rs) * value)]])
